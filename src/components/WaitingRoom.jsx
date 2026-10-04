import React, { useState, useEffect } from 'react';

export default function WaitingRoom({ onQueueComplete }) {
  const [queuePosition, setQueuePosition] = useState(142);
  const [estimatedWait, setEstimatedWait] = useState(12);

  useEffect(() => {
    // Simulate moving forward in the virtual queue
    const interval = setInterval(() => {
      setQueuePosition((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onQueueComplete(); // User enters seat map
          return 0;
        }
        return prev - Math.floor(Math.random() * 15 + 5);
      });
      
      setEstimatedWait((prev) => Math.max(1, Math.ceil(queuePosition / 12)));
    }, 1500);

    return () => clearInterval(interval);
  }, [queuePosition]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 text-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glowing Ambient Backdrop */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl"></div>

        <div className="space-y-2">
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            High Demand Event
          </span>
          <h2 className="text-2xl font-bold">You are in the Virtual Line</h2>
          <p className="text-xs text-slate-400">Please do not refresh or close this page.</p>
        </div>

        {/* Dynamic Queue Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-2xl space-y-4">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500">Your Position in Line</p>
            <p className="text-5xl font-black text-white mt-1">#{Math.max(1, queuePosition)}</p>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((200 - queuePosition) / 200) * 100)}%` }}
            ></div>
          </div>

          <p className="text-xs text-amber-400/90 font-medium">
            ⏱ Estimated Wait Time: ~{estimatedWait} seconds
          </p>
        </div>

        <p className="text-[11px] text-slate-500">
          Once it's your turn, you will have 5 minutes to select your seats and complete checkout.
        </p>
      </div>
    </div>
  );
}