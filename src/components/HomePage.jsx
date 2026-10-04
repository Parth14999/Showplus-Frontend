import React, { useState, useEffect } from 'react';

// ⚠️ Apni API Keys Yahan Paste Karein
const TMDB_API_KEY = "a9da4e7af2a8c74b5e263f809275ab98";
const TICKETMASTER_API_KEY = "qINL4Uk8QD0vyrQy117FnEAyJAWr3cJ3";

export default function HomePage({ onSelectEvent }) {
  const [activeCategory, setActiveCategory] = useState('Movies');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [customCity, setCustomCity] = useState('');
  
  const [movies, setMovies] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Live Movies from TMDB
  useEffect(() => {
    if (activeCategory !== 'Movies') return;

    const fetchLiveMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();

        if (data.results) {
          const formatted = data.results.map((m) => ({
            id: m.id,
            title: m.title,
            poster: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
            rating: m.vote_average ? m.vote_average.toFixed(1) : '8.0',
            genre: 'Cinema',
            synopsis: m.overview || 'No overview available.',
            venue: 'PVR ICON: Cinema Hall',
            showtime: '07:00 PM',
            price: '₹250'
          }));
          setMovies(formatted);
        }
      } catch (err) {
        console.error('Movies Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMovies();
  }, [activeCategory]);

  // 2. Fetch Live Real Concerts from Ticketmaster API based on City
  useEffect(() => {
    if (activeCategory !== 'Concerts') return;

    const fetchLiveConcerts = async () => {
      setLoading(true);
      const queryCity = customCity || selectedCity;

      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${encodeURIComponent(
            queryCity
          )}&apikey=${TICKETMASTER_API_KEY}`
        );
        const data = await res.json();

        if (data._embedded && data._embedded.events) {
          const formattedConcerts = data._embedded.events.map((e) => {
            const venue = e._embedded?.venues?.[0];
            const price = e.priceRanges?.[0];
            
            return {
              id: e.id,
              title: e.name,
              poster: e.images?.[0]?.url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
              rating: '4.8',
              genre: e.classifications?.[0]?.genre?.name || 'Live Music',
              synopsis: e.pleaseNote || e.info || `Live performance in ${queryCity}.`,
              venue: venue ? `${venue.name}, ${venue.city?.name || queryCity}` : `${queryCity} Arena`,
              date: e.dates?.start?.localDate || 'Upcoming',
              time: e.dates?.start?.localTime ? e.dates.start.localTime.slice(0, 5) : '07:00 PM',
              startingPrice: price ? `${price.currency} ${price.min}` : '₹1,500',
              passes: [
                `General Admission - ${price ? price.currency + ' ' + price.min : '₹1,500'}`,
                `VIP Lounge Pass - ${price ? price.currency + ' ' + (price.min * 2.5) : '₹4,000'}`
              ]
            };
          });
          setConcerts(formattedConcerts);
        } else {
          setConcerts([]);
        }
      } catch (err) {
        console.error('Ticketmaster Fetch Error:', err);
        setConcerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveConcerts();
  }, [activeCategory, selectedCity, customCity]);

  // Handle Event / Concert Booking Trigger
  const handleBookingClick = (item) => {
    if (onSelectEvent) {
      onSelectEvent({
        movieId: item.id,
        movieTitle: item.title,
        poster: item.poster,
        theater: item.venue,
        showtime: item.time || item.showtime || "07:00 PM",
        date: item.date || "Today",
        category: activeCategory,
        passes: item.passes || null
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-b from-rose-950/40 via-slate-950 to-slate-950 py-10 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              🔴 Live Global Entertainment Feed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Book Real Movies & Live Concerts
            </h1>
            <p className="text-xs text-slate-400">
              Powered by TMDB & Ticketmaster Live Events API.
            </p>
          </div>

          {/* City Selection Controls (Only visible for Concerts) */}
          {activeCategory === 'Concerts' && (
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-xs font-bold pl-2">📍 City:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCustomCity('');
                  }}
                  className="bg-slate-950 text-xs font-bold text-white px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Tokyo">Tokyo</option>
                </select>
              </div>

              {/* Manual City Search Input */}
              <input
                type="text"
                placeholder="Or type any city..."
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="bg-slate-950 text-xs text-white px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none placeholder-slate-500 w-36"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 space-y-6">
        
        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          {[
            { name: 'Movies', icon: '🎬' },
            { name: 'Concerts', icon: '🎤' }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveCategory(tab.name);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === tab.name
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {activeCategory === 'Movies'
              ? '🔥 Live Movies in Theaters'
              : `🎤 Live Concerts in ${customCity || selectedCity}`}
          </h2>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="inline-block w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400">
              Fetching live {activeCategory.toLowerCase()} feed...
            </p>
          </div>
        ) : activeCategory === 'Movies' ? (
          /* Movies Feed */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((m) => (
              <div
                key={m.id}
                onClick={() => handleBookingClick(m)}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl overflow-hidden transition cursor-pointer flex flex-col justify-between"
              >
                <img src={m.poster} alt={m.title} className="w-full aspect-[3/4] object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm">{m.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{m.synopsis}</p>
                  <button className="w-full mt-2 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold">
                    Book Movie Seat →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : concerts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              No live Ticketmaster concerts found in "{customCity || selectedCity}". Try searching another city like London, New York, or Los Angeles!
            </p>
          </div>
        ) : (
          /* Real Ticketmaster Concerts Feed */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.map((c) => (
              <div
                key={c.id}
                onClick={() => handleBookingClick(c)}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl overflow-hidden transition cursor-pointer flex flex-col justify-between"
              >
                <div className="relative">
                  <img src={c.poster} alt={c.title} className="w-full aspect-[16/9] object-cover" />
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    {c.genre}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-base line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-slate-400">📅 {c.date} • 🕒 {c.time}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">📍 {c.venue}</p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Price</span>
                      <span className="text-sm font-extrabold text-emerald-400">{c.startingPrice}</span>
                    </div>
                    <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold">
                      Book Live Pass →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}