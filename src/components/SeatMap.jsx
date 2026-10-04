import React from 'react';
import { useSeatStore } from '../store/useSeatStore';

const rows = [
  { id: 'A', type: 'VIP', price: 500 },
  { id: 'B', type: 'VIP', price: 500 },
  { id: 'C', type: 'Premium', price: 300 },
  { id: 'D', type: 'Premium', price: 300 },
  { id: 'E', type: 'General', price: 150 },
  { id: 'F', type: 'General', price: 150 },
];

const seatsPerRow = [1, 2, 3, 4, 5, 6, 7, 8];

// Pre-booked dummy seats to demonstrate occupied state
const occupiedSeats = ['A3', 'C5', 'C6', 'E2'];

export default function SeatMap() {
  const { selectedSeats, toggleSeat } = useSeatStore();

  return (
    <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-xl">
      
      {/* Screen Visual Indicator */}
      <div className="w-full max-w-lg space-y-1 text-center">
        <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">STAGE / SCREEN THIS WAY</p>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3 my-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-3">
            <span className="w-6 text-xs font-bold text-slate-500 text-right">{row.id}</span>
            <div className="flex gap-2">
              {seatsPerRow.map((seatNum) => {
                const seatId = `${row.id}${seatNum}`;
                const isOccupied = occupiedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let buttonStyle = 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700';
                if (isOccupied) {
                  buttonStyle = 'bg-slate-800/40 text-slate-600 border-slate-800/40 cursor-not-allowed';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/40 scale-105';
                }

                return (
                  <button
                    key={seatId}
                    disabled={isOccupied}
                    onClick={() => toggleSeat(seatId)}
                    className={`w-9 h-9 rounded-lg border text-xs font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer ${buttonStyle}`}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-slate-500 font-medium ml-2 uppercase">{row.type}</span>
          </div>
        ))}
      </div>

      {/* Legend Bar */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-800 border border-slate-700 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-800/40 border border-slate-800 rounded"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
}