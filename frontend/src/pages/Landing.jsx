import React from 'react';
import { Link, Navigate } from 'react-router-dom';

const Landing = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      <div className="w-full max-w-5xl mx-auto arch-container bg-theatre-teal text-center pt-32 pb-16 mb-16 overflow-visible shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.5)] mt-12 px-4">
        <div className="arch-tab-left"></div>
        <div className="arch-tab-right"></div>
        
        <h1 className="text-6xl md:text-8xl font-serif font-black text-theatre-gold tracking-wide mb-6 relative z-10" style={{ textShadow: '4px 4px 0px #1A1A1A' }}>
          StageLink
        </h1>
        <p className="text-theatre-pink font-display font-bold uppercase tracking-[0.3em] text-sm md:text-lg relative z-10 mb-10">
          Where Theatre Comes Together
        </p>
        
        <p className="text-theatre-offwhite font-sans text-lg max-w-2xl mx-auto mb-12">
          Discover local plays, audition for roles, follow brilliant actors, and support the vibrant stage community. Built exclusively for actors, directors, and audiences.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/login" className="btn-primary inline-block">
            Login
          </Link>
          <Link to="/signup" className="btn-secondary bg-theatre-offwhite inline-block">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
