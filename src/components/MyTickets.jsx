import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// ✅ Base API URL declaration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function MyTickets() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. User ki Bookings Fetch karna
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // ✅ FIX: Template literal and API_URL variable
        const res = await fetch(`${API_URL}/api/bookings/${encodeURIComponent(user.email)}`);
        const data = await res.json();

        if (res.ok) {
          const bookingList = data.bookings || (Array.isArray(data) ? data : []);
          setTickets(bookingList);
        }
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  // 2. Browser Print / Safe PDF Download
  const handleDownloadPDF = (ticketId) => {
    window.print();
  };

  // 3. Cancel Ticket & Refund Handler
  const handleCancelTicket = async (ticket) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your booking for ${ticket.movieTitle || 'this movie'}?`
    );

    if (!confirmCancel) return;

    try {
      // ✅ FIX: Dynamic API_URL usage
      const res = await fetch(`${API_URL}/api/bookings/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: ticket._id,
          paymentId: ticket.paymentId && ticket.paymentId !== 'N/A' ? ticket.paymentId : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`✅ ${data.message || 'Ticket cancelled successfully!'}`);
        // Screen se immediately ticket remove karna
        setTickets((prev) => prev.filter((t) => t._id !== ticket._id));
      } else {
        alert(`❌ Cancellation failed: ${data.message || data.error || 'Server error'}`);
      }
    } catch (err) {
      console.error("Cancel Ticket Error:", err);
      alert("Server error! Please check if your backend server is running.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 font-semibold animate-pulse">Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">My Booked Tickets 🎟️</h1>
        <p className="text-sm text-slate-400 mb-8">Manage your event bookings, print passes, or process cancellations.</p>

        {tickets.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg mb-4">No active ticket bookings found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div 
                key={ticket._id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
              >
                {/* Printable Container */}
                <div id={`ticket-card-${ticket._id}`} className="p-4 bg-slate-900 rounded-xl">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                        {ticket.category || 'EVENT PASS'}
                      </span>
                      <h2 className="text-2xl font-black text-white">{ticket.movieTitle || 'Movie Ticket'}</h2>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">THEATER / VENUE</p>
                      <p className="font-semibold text-slate-200">{ticket.theater || 'PVR Cinema'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">SHOWTIME</p>
                      <p className="font-semibold text-slate-200">{ticket.showtime || 'Standard'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">SEATS BOOKED</p>
                      <p className="font-extrabold text-rose-500">
                        {Array.isArray(ticket.seats) ? ticket.seats.join(', ') : ticket.seats}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">TOTAL PAID</p>
                      <p className="font-bold text-slate-100">₹{ticket.totalAmount}</p>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-800 pt-3 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2">
                    <p>Payment ID: <span className="font-mono text-slate-300">{ticket.paymentId || 'N/A'}</span></p>
                    <p>Booking ID: <span className="font-mono font-bold text-rose-400">#{ticket._id ? ticket._id.slice(-6).toUpperCase() : 'N/A'}</span></p>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap justify-end gap-3 print:hidden">
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(ticket._id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    📥 Print / Save PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCancelTicket(ticket)}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    🚫 Cancel & Refund
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}