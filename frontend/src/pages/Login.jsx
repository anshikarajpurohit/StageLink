import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.error || 
        (err.message === 'Network Error' 
          ? 'Cannot connect to backend server. Please verify backend URL.' 
          : 'Login failed')
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 mb-16">
      <div className="playbill-card border-theatre-teal bg-theatre-gold !rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-serif font-black text-theatre-teal mb-4">StageLink</h2>
          <span className="pill-tag bg-theatre-coral text-theatre-offwhite border-theatre-black">Admit One</span>
        </div>
        
        {error && <div className="bg-red-50 text-red-800 p-3 mb-4 rounded-xl border-2 border-red-200 text-sm font-sans font-bold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Email Address</label>
            <input type="email" className="input-field border-theatre-teal" required 
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Password</label>
            <input type="password" className="input-field border-theatre-teal" required 
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary w-full mt-6 text-lg py-4">Enter Theatre</button>
        </form>
        
        <div className="w-full h-[3px] bg-theatre-teal/20 my-8 rounded-full"></div>
        <p className="text-center text-sm font-display font-bold text-theatre-teal uppercase tracking-wider">
          Don't have a ticket? <Link to="/signup" className="text-theatre-coral hover:text-theatre-pink transition ml-2 underline decoration-2 underline-offset-4">Box Office</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
