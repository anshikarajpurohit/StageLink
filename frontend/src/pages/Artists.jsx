import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Artists = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const { data } = await api.get('/users/actors');
        setActors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActors();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 mb-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-serif font-black text-theatre-gold tracking-wide" style={{ textShadow: '4px 4px 0px #1A1A1A' }}>Artists</h1>
        <p className="text-theatre-pink font-display font-bold uppercase tracking-[0.2em] mt-6">Discover Talent</p>
      </header>

      {loading ? (
        <div className="text-center font-serif text-2xl italic text-theatre-gold">Loading artists...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {actors.map(actor => (
            <div key={actor._id} className="playbill-card text-center !p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-black text-2xl text-theatre-teal mb-2">{actor.name}</h3>
                <p className="text-theatre-teal/70 font-display font-bold uppercase tracking-widest text-xs mb-4">📍 {actor.city}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {actor.skills?.slice(0,3).map((skill, i) => (
                    <span key={i} className="pill-tag bg-theatre-gold/30 border-theatre-gold text-theatre-teal !text-[10px] px-2">{skill}</span>
                  ))}
                  {actor.skills?.length > 3 && <span className="text-xs text-theatre-teal/50 font-sans italic mt-1">+{actor.skills.length - 3} more</span>}
                </div>
              </div>
              <Link to={`/profile/${actor._id}`} className="btn-secondary w-full text-xs py-2 block border-theatre-teal text-theatre-teal hover:bg-theatre-teal hover:text-theatre-gold shadow-[2px_2px_0px_0px_#1A1A1A]">View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Artists;
