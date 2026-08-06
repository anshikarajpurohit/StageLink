import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const HomeFeed = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ city: '', date: '', q: '' });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.q) query.append('q', filters.q);
      if (filters.city) query.append('city', filters.city);
      if (filters.date) query.append('date', filters.date);
      const { data } = await api.get(`/events?${query.toString()}`);
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      {/* Hero Banner with Arch */}
      <div className="w-full max-w-5xl mx-auto arch-container bg-theatre-teal text-center pt-32 pb-16 mb-16 overflow-visible mt-12 px-4 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.5)]">
        <div className="arch-tab-left"></div>
        <div className="arch-tab-right"></div>
        
        <h1 className="text-6xl md:text-8xl font-serif font-black text-theatre-gold tracking-wide mb-6 relative z-10" style={{ textShadow: '4px 4px 0px #1A1A1A' }}>
          StageLink
        </h1>
        <p className="text-theatre-pink font-display font-bold uppercase tracking-[0.3em] text-sm md:text-lg relative z-10 mb-10">
          Where Theatre Comes Together
        </p>
        <Link to="/create-event" className="btn-primary inline-block">
          Stage a Production
        </Link>
      </div>

      {/* Filter Section */}
      <div className="mb-16 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 bg-theatre-gold p-6 border-4 border-theatre-black shadow-solid-black rounded-2xl relative z-20">
        <input 
          type="text" 
          placeholder="Search plays or groups..." 
          className="w-full bg-theatre-offwhite border-2 border-theatre-black px-6 py-4 focus:outline-none focus:border-theatre-coral font-display font-bold text-theatre-black uppercase tracking-wider text-sm placeholder-gray-500 rounded-full shadow-inner"
          onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
        />
        <input 
          type="text" 
          placeholder="Filter by City..." 
          className="w-full bg-theatre-offwhite border-2 border-theatre-black px-6 py-4 focus:outline-none focus:border-theatre-coral font-display font-bold text-theatre-black uppercase tracking-wider text-sm placeholder-gray-500 rounded-full shadow-inner"
          onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
        />
        <input 
          type="date" 
          className="w-full bg-theatre-offwhite border-2 border-theatre-black px-6 py-4 focus:outline-none focus:border-theatre-coral font-display font-bold text-theatre-black uppercase tracking-wider text-sm text-gray-600 rounded-full shadow-inner"
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <header className="text-center mb-16 relative max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-serif font-black tracking-wide text-theatre-gold" style={{ textShadow: '3px 3px 0px #1A1A1A' }}>Now Showing</h2>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-8">
        {events.length === 0 ? (
          <div className="col-span-full text-center text-theatre-pink font-display italic py-16 text-lg">
            No performances scheduled for this criteria.
          </div>
        ) : (
          events.map(event => (
            <div key={event._id} className="playbill-card flex flex-col group">
              <div className="text-center border-b-[3px] border-theatre-black pb-5 mb-5">
                <Link to={`/group/${event.group?._id}`} className="text-[10px] font-display uppercase tracking-widest text-theatre-coral font-bold hover:text-theatre-teal transition block mb-2">
                  {event.group?.name || 'Independent Production'} Presents
                </Link>
                <h3 className="text-3xl font-serif font-black tracking-wide mb-3 text-theatre-teal group-hover:text-theatre-coral transition leading-tight">{event.title}</h3>
                <span className="pill-tag mb-2">🎭 Play</span>
              </div>
              
              <div className="flex-grow font-sans text-sm space-y-4">
                <div className="flex justify-between border-b border-dashed border-theatre-teal/30 pb-2">
                  <span className="font-display font-bold uppercase tracking-wider text-theatre-teal/60 text-xs">Date & Time</span>
                  <span className="font-bold text-theatre-teal text-right">{new Date(event.date).toLocaleDateString()} <br className="md:hidden"/> {event.time}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-theatre-teal/30 pb-2">
                  <span className="font-display font-bold uppercase tracking-wider text-theatre-teal/60 text-xs">Venue</span>
                  <span className="font-bold text-theatre-teal text-right">{event.venue ? `${event.venue}, ${event.city}` : event.city}</span>
                </div>
                <p className="pt-3 text-theatre-teal/80 leading-relaxed font-medium text-justify">{event.description}</p>
              </div>
              
              <div className="mt-8 text-center pt-4">
                {event.ticketLink ? (
                  <a href={event.ticketLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block w-full">
                    Box Office Tickets
                  </a>
                ) : (
                  <button className="btn-secondary w-full" disabled>Tickets at Door</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeFeed;
