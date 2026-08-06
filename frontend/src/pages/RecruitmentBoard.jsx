import React, { useState, useEffect } from 'react';
import api from '../api';

const RecruitmentBoard = () => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/recruitment');
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInterest = async (postId) => {
    try {
      await api.post(`/recruitment/${postId}/interest`);
      fetchPosts();
    } catch (err) {
      alert('Failed to register interest. Ensure you are logged in.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-16 mt-12">
      <header className="text-center mb-16 relative">
        <h1 className="text-5xl md:text-7xl font-serif font-black text-theatre-gold tracking-wide" style={{ textShadow: '4px 4px 0px #1A1A1A' }}>Cast & Crew</h1>
        <p className="text-theatre-pink font-display font-bold uppercase tracking-[0.2em] mt-6">Open Auditions & Opportunities</p>
      </header>

      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="text-center text-theatre-pink font-display italic py-12 text-lg">
            The casting board is currently empty.
          </div>
        ) : (
          posts.map(post => {
            const hasExpressedInterest = post.interestedUsers?.includes(user.id);
            return (
              <div key={post._id} className="bg-theatre-offwhite border-4 border-theatre-gold shadow-solid-black p-6 md:p-8 flex flex-col md:flex-row justify-between items-center rounded-2xl">
                <div className="mb-6 md:mb-0 w-full md:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-display font-bold uppercase tracking-widest text-theatre-coral block">
                      {post.group?.name || 'Production Group'}
                    </span>
                    <span className="pill-tag bg-theatre-gold">{post.role.includes('Actor') ? '🎭 Actor' : '🎬 Crew'}</span>
                  </div>
                  <h3 className="text-3xl font-serif font-black text-theatre-teal mb-3">{post.role}</h3>
                  <p className="text-theatre-teal/80 font-sans font-medium mb-5 max-w-lg">{post.description}</p>
                  <div className="flex items-center gap-4 text-xs font-display font-bold text-theatre-teal uppercase tracking-wider">
                    <span className="bg-theatre-pink/30 px-3 py-1 rounded-full border-2 border-theatre-pink">📍 {post.city}</span>
                    <span className="bg-theatre-coral/20 px-3 py-1 rounded-full border-2 border-theatre-coral text-theatre-coral">👥 {post.interestedUsers?.length || 0} Interested</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  {isAuthenticated ? (
                    <button 
                      onClick={() => handleInterest(post._id)}
                      disabled={hasExpressedInterest}
                      className={`w-full md:w-auto px-8 py-3 border-2 transition font-display font-bold uppercase tracking-wider rounded-full shadow-solid-black active:shadow-none active:translate-y-[4px] active:translate-x-[4px] text-sm ${
                        hasExpressedInterest 
                          ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed shadow-none translate-y-[4px] translate-x-[4px]' 
                          : 'bg-theatre-coral text-theatre-offwhite border-theatre-black hover:bg-theatre-pink hover:text-theatre-teal'
                      }`}
                    >
                      {hasExpressedInterest ? 'Interest Registered' : "I'm Interested"}
                    </button>
                  ) : (
                    <div className="text-xs font-display font-bold text-theatre-coral uppercase tracking-wider border-2 border-theatre-coral/30 p-4 rounded-full text-center">Log in to express interest</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecruitmentBoard;
