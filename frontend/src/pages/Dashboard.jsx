import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) return <div className="text-center mt-20 font-serif text-3xl italic text-theatre-gold">Drawing the curtains...</div>;
  if (!data) return null;

  const { user, group, events, recruitmentPosts } = data;

  return (
    <div className="max-w-5xl mx-auto mt-12 mb-16">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-serif font-black text-theatre-gold tracking-wide" style={{ textShadow: '4px 4px 0px #1A1A1A' }}>My Stage</h1>
        <p className="text-theatre-pink font-display font-bold uppercase tracking-[0.2em] mt-6">Welcome back, {user.name}</p>
      </header>

      {user.role === 'theatre_group' && (
        <div className="space-y-12">
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-event" className="btn-primary text-center">Create Event</Link>
            <Link to="/create-recruitment" className="btn-secondary bg-theatre-offwhite text-center">Post Casting Call</Link>
          </div>

          {/* Group Profile Shortcut */}
          {group && (
            <div className="text-center">
              <Link to={`/group/${group._id}`} className="text-theatre-gold hover:text-theatre-coral font-display font-bold uppercase tracking-widest text-sm underline decoration-2 underline-offset-4">
                View Public Group Page
              </Link>
            </div>
          )}

          {/* My Events */}
          <div>
            <h3 className="font-serif font-black text-3xl text-theatre-gold mb-6 border-b-2 border-theatre-gold/30 pb-2">Our Productions</h3>
            {events.length === 0 ? (
              <p className="text-theatre-pink/80 font-sans italic">No events scheduled.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {events.map(ev => (
                  <div key={ev._id} className="playbill-card !p-5">
                    <h4 className="font-serif font-black text-xl text-theatre-teal mb-2">{ev.title}</h4>
                    <p className="text-sm text-theatre-teal/70 font-sans">{new Date(ev.date).toLocaleDateString()} | {ev.venue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Recruitment Posts */}
          <div>
            <h3 className="font-serif font-black text-3xl text-theatre-gold mb-6 border-b-2 border-theatre-gold/30 pb-2">Our Casting Calls</h3>
            {recruitmentPosts.length === 0 ? (
              <p className="text-theatre-pink/80 font-sans italic">No casting calls posted.</p>
            ) : (
              <div className="space-y-4">
                {recruitmentPosts.map(post => (
                  <div key={post._id} className="bg-theatre-offwhite border-2 border-theatre-gold p-5 rounded-xl shadow-solid-black">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-serif font-black text-xl text-theatre-teal">{post.role}</h4>
                      <span className="pill-tag bg-theatre-coral text-theatre-offwhite">{post.interestedUsers?.length || 0} Interested</span>
                    </div>
                    {post.interestedUsers?.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-dashed border-theatre-teal/20">
                        <p className="text-xs font-display font-bold uppercase tracking-wider text-theatre-teal/60 mb-3">Interested Artists:</p>
                        <div className="flex flex-wrap gap-2">
                          {post.interestedUsers.map(u => (
                            <Link key={u._id} to={`/profile/${u._id}`} className="text-sm font-sans font-bold text-theatre-teal bg-theatre-gold/30 px-3 py-1 rounded-full hover:bg-theatre-gold hover:text-theatre-teal transition border border-theatre-teal/20">
                              {u.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {user.role === 'actor' && (
        <div className="space-y-12">
          <div className="flex justify-center">
            <Link to={`/profile/${user._id}`} className="btn-primary">View / Edit Profile</Link>
          </div>

          <div>
            <h3 className="font-serif font-black text-3xl text-theatre-gold mb-6 border-b-2 border-theatre-gold/30 pb-2">My Applications</h3>
            {recruitmentPosts.length === 0 ? (
              <p className="text-theatre-pink/80 font-sans italic">You haven't applied to any casting calls yet.</p>
            ) : (
              <div className="space-y-4">
                {recruitmentPosts.map(post => (
                  <div key={post._id} className="bg-theatre-offwhite border-2 border-theatre-gold p-5 rounded-xl shadow-solid-black">
                    <h4 className="font-serif font-black text-xl text-theatre-teal mb-1">{post.role}</h4>
                    <p className="text-sm text-theatre-teal/70 font-display font-bold uppercase">{post.group?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {user.role === 'audience' && (
        <div className="text-center space-y-6">
          <p className="text-theatre-offwhite font-sans text-lg">You have an Audience account. Browse the latest events and find your next show!</p>
          <Link to="/home" className="btn-primary inline-block">Browse Events</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
