import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    fetch('http://localhost:4000/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Error loading admin stats:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 5 seconds for live analytics
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse font-medium">Loading live analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer transition"
          >
            ← Exit Admin Mode
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-white tracking-wide">Organizer Analytics</h1>
            <p className="text-[11px] text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Metrics Active
            </p>
          </div>
          <button 
            onClick={fetchStats} 
            className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Revenue</p>
            <p className="text-2xl font-black text-emerald-400">₹{stats?.totalRevenue || 0}</p>
            <p className="text-[10px] text-slate-400">Gross ticket earnings</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tickets Sold</p>
            <p className="text-2xl font-black text-rose-500">{stats?.ticketsSold || 0} / {stats?.totalCapacity}</p>
            <p className="text-[10px] text-slate-400">Seats claimed</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Occupancy Rate</p>
            <p className="text-2xl font-black text-indigo-400">{stats?.occupancyRate || 0}%</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats?.occupancyRate || 0}%` }} 
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Registered Users</p>
            <p className="text-2xl font-black text-amber-400">{stats?.totalUsers || 0}</p>
            <p className="text-[10px] text-slate-400">Active accounts</p>
          </div>

        </div>

        {/* Recent Transactions List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200">Recent Live Transactions</h2>
          
          {stats?.recentBookings?.length === 0 ? (
            <p className="text-xs text-slate-500">No bookings recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {stats?.recentBookings?.map((tx, idx) => (
                <div key={tx._id || idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{tx.userEmail}</p>
                    <p className="text-slate-500 text-[10px]">Seats: {Array.isArray(tx.seats) ? tx.seats.join(', ') : tx.seats}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-400">+₹{tx.totalAmount}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {new Date(tx.createdAt || Date.now()).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}