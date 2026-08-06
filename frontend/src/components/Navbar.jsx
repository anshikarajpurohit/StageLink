import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-theatre-teal text-theatre-gold py-4 shadow-solid-black border-b-[4px] border-theatre-gold relative z-50">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
        <Link to="/" className="text-4xl font-serif font-black text-theatre-gold tracking-wide hover:text-theatre-coral transition">
          StageLink
        </Link>
        <div className="flex gap-4 md:gap-6 items-center font-display font-bold uppercase text-sm tracking-wider flex-wrap justify-end">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-theatre-coral transition hidden sm:inline">Dashboard</Link>
              <Link to="/home" className="hover:text-theatre-coral transition">Events</Link>
              <Link to="/artists" className="hover:text-theatre-coral transition">Artists</Link>
              <Link to="/recruitment" className="hover:text-theatre-coral transition hidden sm:inline">Cast & Crew</Link>
              <span className="text-theatre-gold/50 hidden md:inline">|</span>
              <button onClick={handleLogout} className="text-xs bg-theatre-coral text-theatre-teal px-5 py-2 hover:bg-theatre-pink transition border-2 border-theatre-teal rounded-full shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                EXIT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-theatre-coral transition">Login</Link>
              <Link to="/signup" className="hover:text-theatre-coral transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
