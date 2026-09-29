import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'audience', city: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.error || 
        (err.message === 'Network Error' 
          ? 'Cannot connect to backend server. Please verify backend URL.' 
          : 'Signup failed')
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-16">
      <div className="playbill-card border-theatre-teal bg-theatre-gold !rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-serif font-black text-theatre-teal mb-4">StageLink</h2>
          <span className="pill-tag bg-theatre-pink text-theatre-teal border-theatre-black">Season Pass</span>
        </div>
        
        {error && <div className="bg-red-50 text-red-800 p-3 mb-4 rounded-xl border-2 border-red-200 text-sm font-sans font-bold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Full Name / Group Name</label>
            <input type="text" className="input-field border-theatre-teal py-3" required 
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Email Address</label>
            <input type="email" className="input-field border-theatre-teal py-3" required 
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Password</label>
            <input type="password" className="input-field border-theatre-teal py-3" required 
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">City</label>
              <input type="text" className="input-field border-theatre-teal py-3" required 
                onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Role</label>
              <select className="input-field border-theatre-teal py-3 appearance-none font-bold" onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="audience">Audience</option>
                <option value="actor">Actor</option>
                <option value="theatre_group">Theatre Group</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-8 text-lg py-4">Secure Tickets</button>
        </form>
        
        <div className="w-full h-[3px] bg-theatre-teal/20 my-6 rounded-full"></div>
        <p className="text-center text-sm font-display font-bold text-theatre-teal uppercase tracking-wider">
          Already have a ticket? <Link to="/login" className="text-theatre-coral hover:text-theatre-pink transition ml-2 underline decoration-2 underline-offset-4">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
