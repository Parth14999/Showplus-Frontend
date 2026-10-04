import React, { useState } from 'react';
import { useSeatStore } from '../store/useSeatStore';
import { useAuthStore } from '../store/useAuthStore';

// Helper function to dynamically load Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutBar({ onProceed, activeShowtime }) {
  const { selectedSeats, getTotalPrice, clearSelectedSeats } = useSeatStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const totalPrice = getTotalPrice();

  // 💳 Function to save booking after successful payment
  const saveBookingToDB = async (paymentId) => {
    try {
      const res = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          seats: selectedSeats,
          totalAmount: totalPrice,
          paymentId: paymentId,
          category: activeShowtime?.category || 'Movies',
          movieTitle: activeShowtime?.movieTitle || activeShowtime?.title || "Movie Event",
          theater: activeShowtime?.theater || activeShowtime?.venue || "PVR Cinema",
          showtime: activeShowtime?.showtime || "Standard Show",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Clear selected seats state if store provides method or fallback empty
        if (typeof clearSelectedSeats === 'function') {
          clearSelectedSeats();
        }
        
        if (onProceed) onProceed(data.booking);
      } else {
        alert(`Booking failed: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to save booking to backend.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Payment Process
  const handleBooking = async () => {
    if (!user) {
      alert('Please log in first to book tickets!');
      return;
    }

    setLoading(true);

    // Ensure Razorpay SDK script is present
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Razorpay Order ID from backend
      const orderRes = await fetch('http://localhost:4000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert('Payment order creation failed!');
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: "rzp_test_TPmgyrf1y0WrqK", // Test Key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SHOWPulse Tickets",
        description: `Booking for ${activeShowtime?.movieTitle || activeShowtime?.title || 'Event'}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Payment Success Callback
          console.log("Payment Successful:", response.razorpay_payment_id);
          await saveBookingToDB(response.razorpay_payment_id);
        },
        prefill: {
          name: user.name || "Customer",
          email: user.email,
          contact: "9999999999",
        },
        theme: {
          color: "#e11d48", // Rose Theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false); // Re-enable button if user exits gateway modal
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Payment Error:', err);
      alert('Payment failed to initialize.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            {activeShowtime?.movieTitle || activeShowtime?.title 
              ? `${activeShowtime.movieTitle || activeShowtime.title} (${activeShowtime.showtime || 'Live'})` 
              : 'Selected Seats'}
          </p>
          <p className="text-sm font-bold text-slate-100">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Price</p>
            <p className="text-xl font-black text-rose-500">₹{totalPrice}</p>
          </div>

          <button
            disabled={selectedSeats.length === 0 || loading}
            onClick={handleBooking}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg ${
              selectedSeats.length > 0 && !loading
                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-rose-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {loading ? 'Processing Payment...' : 'Confirm & Pay →'}
          </button>
        </div>
      </div>
    </div>
  );
}