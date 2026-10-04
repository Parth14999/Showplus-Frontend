import React, { useState } from 'react';

export default function ShowtimeModal({ movie, onClose, onSelectShowtime }) {
  if (!movie) return null;

  const [selectedTheater, setSelectedTheater] = useState(movie.theaters[0]?.name || '');
  const [selectedTime, setSelectedTime] = useState('');

  const currentTheaterObj = movie.theaters.find((t) => t.name === selectedTheater);

  const handleProceed = () => {
    if (!selectedTime) {
      alert('Please select a showtime slot first!');
      return;
    }

    onSelectShowtime({
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      theater: selectedTheater,
      showtime: selectedTime,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full cursor-pointer text-xs"
        >
          ✕
        </button>

        {/* Movie Info Header */}
        <div className="flex gap-4 items-start">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-20 h-28 object-cover rounded-xl border border-slate-800"
          />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              {movie.rating}
            </span>
            <h2 className="text-lg font-black text-white">{movie.title}</h2>
            <p className="text-xs text-slate-400">{movie.genre} • {movie.duration}</p>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{movie.synopsis}</p>
          </div>
        </div>

        {/* Step A: Choose Cinema / Theater */}
        <div className="space-y-2 border-t border-slate-800/80 pt-4">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Select Theater</p>
          <div className="space-y-2">
            {movie.theaters.map((theater) => (
              <button
                key={theater.name}
                onClick={() => {
                  setSelectedTheater(theater.name);
                  setSelectedTime(''); // Reset time selection on theater switch
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition cursor-pointer flex justify-between items-center ${
                  selectedTheater === theater.name
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>🍿 {theater.name}</span>
                {selectedTheater === theater.name && <span className="text-rose-500 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Step B: Choose Showtime Slot */}
        {currentTheaterObj && (
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. Select Showtime Slot</p>
            <div className="grid grid-cols-3 gap-2">
              {currentTheaterObj.showtimes.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    selectedTime === slot
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ⏰ {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Action Button */}
        <button
          onClick={handleProceed}
          disabled={!selectedTime}
          className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
            selectedTime
              ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          Select Seats for {selectedTime || 'Showtime'} →
        </button>

      </div>
    </div>
  );
}