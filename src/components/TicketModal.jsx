import React from 'react';

export default function TicketModal({ booking, onClose }) {
  if (!booking) return null;

  const titleLower = (booking.movieTitle || booking.title || '').toLowerCase();

  // Smart check: Agar category 'Concerts' ho ya title me concert/tour/live vagairah ho
  const isConcert = 
    booking.category === 'Concerts' || 
    titleLower.includes('concert') || 
    titleLower.includes('tour') || 
    titleLower.includes('live') ||
    titleLower.includes('fest') ||
    titleLower.includes('jay-z') ||
    titleLower.includes('arijit') ||
    titleLower.includes('garrix') ||
    titleLower.includes('sunburn');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-slate-950/60 text-slate-400 hover:text-white rounded-full flex items-center justify-center text-xs transition"
        >
          ✕
        </button>

        {/* Dynamic Header */}
        <div className={`p-6 text-center border-b border-slate-800 ${
          isConcert 
            ? 'bg-gradient-to-r from-purple-900/60 via-rose-900/40 to-slate-900' 
            : 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900'
        }`}>
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
            isConcert
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {isConcert ? '🎤 Official Event Pass' : '🎬 Movie Admit One'}
          </span>
          <h2 className="text-xl font-black text-white mt-2 line-clamp-1">
            {booking.movieTitle || booking.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            📍 {booking.theater || booking.venue}
          </p>
        </div>

        {/* TICKET BODY */}
        <div className="p-6 space-y-6">
          
          {/* CONCERT PASS LAYOUT */}
          {isConcert ? (
            <div className="space-y-4">
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400 block">Access Pass</span>
                  <span className="text-sm font-black text-white">VIP / Fan Zone Entry</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gate / Entry</span>
                  <span className="text-sm font-black text-purple-300">Gate #04</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Event Date</span>
                  <span className="font-bold text-white">{booking.date || 'Upcoming'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Doors Open</span>
                  <span className="font-bold text-white">{booking.showtime || '06:00 PM'}</span>
                </div>
              </div>
            </div>
          ) : (
            /* MOVIE STUB LAYOUT */
            <div className="space-y-4">
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Screen</span>
                  <span className="text-sm font-black text-white">Screen 02 (AUDI 2)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Showtime</span>
                  <span className="text-sm font-black text-rose-300">{booking.showtime || '07:00 PM'}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Seats Reserved</span>
                <span className="text-sm font-black text-emerald-400">
                  {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats || 'A1, A2'}
                </span>
              </div>
            </div>
          )}

          {/* DASHED TICKET SEPARATOR */}
          <div className="relative flex items-center justify-between py-2">
            <div className="w-5 h-5 bg-slate-950 rounded-full -ml-8 border-r border-slate-800"></div>
            <div className="flex-1 border-b-2 border-dashed border-slate-800"></div>
            <div className="w-5 h-5 bg-slate-950 rounded-full -mr-8 border-l border-slate-800"></div>
          </div>

          {/* QR CODE & BARCODE SECTION */}
          <div className="text-center space-y-3">
            <div className="inline-block p-2 bg-white rounded-xl shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${booking._id || 'SHOWPULSE-TICKET'}`}
                alt="Ticket QR Code"
                className="w-24 h-24"
              />
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider">
              ID: {booking._id || 'SP-998234-LIVE'}
            </p>
          </div>

        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            Done & Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}