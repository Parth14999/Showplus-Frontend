import React, { useState } from "react";
import HomePage from "./components/HomePage";
import WaitingRoom from "./components/WaitingRoom";
import SeatMap from "./components/SeatMap";
import CheckoutBar from "./components/CheckoutBar";
import AuthModal from "./components/AuthModal";
import TicketModal from "./components/TicketModal";
import MyTickets from "./components/MyTickets";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { useSeatStore } from "./store/useSeatStore";

export default function App() {
  const [currentView, setCurrentView] = useState("HOME"); // "HOME" | "QUEUE" | "SEAT_MAP" | "MY_TICKETS"
  const { user } = useAuthStore();
  const { clearSeats } = useSeatStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [activeShowtime, setActiveShowtime] = useState(null);

const handleStartBooking = (showtimeDetails) => {
  if (!user) {
    setIsAuthOpen(true);
    return;
  }
  // Category (Movies ya Concerts) ko forward preserve karo
  setActiveShowtime({
    ...showtimeDetails,
    category: showtimeDetails.category || 'Movies'
  });
  setCurrentView("QUEUE");
};

const handleBookingSuccess = (savedBooking) => {
  setConfirmedBooking({
    ...savedBooking,
    // Final modal dikhane ke liye category preserved rakho
    category: activeShowtime?.category || savedBooking.category || 'Movies'
  });
  clearSeats();
};

  const handleCloseModal = () => {
    setConfirmedBooking(null);
    setCurrentView("HOME");
  };

  const handleNavigate = (tab) => {
    if (tab === "home") setCurrentView("HOME");
    else if (tab === "tickets") setCurrentView("MY_TICKETS");
    else if (tab === "login") setIsAuthOpen(true);
  };

  return (
    <>
      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Ticket Modal */}
      <TicketModal booking={confirmedBooking} onClose={handleCloseModal} />

      {/* Global Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        activeTab={currentView.toLowerCase()} 
      />

      {/* VIEW 1: HOME PAGE */}
      {currentView === "HOME" && (
        <div>
          <HomePage onSelectEvent={handleStartBooking} />
        </div>
      )}

      {/* VIEW 2: MY TICKETS PAGE */}
      {currentView === "MY_TICKETS" && (
        <MyTickets onBack={() => setCurrentView("HOME")} />
      )}

      {/* VIEW 3: VIRTUAL WAITING ROOM */}
      {currentView === "QUEUE" && (
        <WaitingRoom onQueueComplete={() => setCurrentView("SEAT_MAP")} />
      )}

      {/* VIEW 4: SEAT MAP */}
      {currentView === "SEAT_MAP" && (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 space-y-6 relative pb-24">
          <header className="w-full max-w-4xl flex items-center justify-between">
            <button
              onClick={() => setCurrentView("HOME")}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              ← Back to Home
            </button>

            {/* Dynamic Movie & Theater Info */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {activeShowtime?.movieTitle || "Movie Seat Booking"}
              </h1>
              <p className="text-xs text-rose-400 font-medium">
                🍿 {activeShowtime?.theater || "Cinema"} • ⏰ {activeShowtime?.showtime || "Showtime"}
              </p>
            </div>

            <div className="w-20"></div>
          </header>

          <SeatMap />
          <CheckoutBar onProceed={handleBookingSuccess} activeShowtime={activeShowtime} />
        </div>
      )}
    </>
  );
}