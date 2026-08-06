import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({ 
    title: '', date: '', time: '', venue: '', city: '', description: '', ticketLink: '' 
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    }
  };

  if (user.role !== 'theatre_group') {
    return <div className="text-center mt-20 font-serif text-3xl text-theatre-gold">Only Theatre Groups can create events.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-16">
      <div className="playbill-card border-theatre-teal bg-theatre-gold !rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-serif font-black text-theatre-teal mb-4">Stage a Production</h2>
          <span className="pill-tag bg-theatre-pink text-theatre-teal border-theatre-black">Director's Chair</span>
        </div>
        
        {error && <div className="bg-red-50 text-red-800 p-3 mb-6 rounded-xl border-2 border-red-200 text-sm font-sans font-bold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Production Title</label>
            <input type="text" className="input-field border-theatre-teal" required 
              onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Date</label>
              <input type="date" className="input-field border-theatre-teal" required 
                onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Time</label>
              <input type="time" className="input-field border-theatre-teal" 
                onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Venue</label>
              <input type="text" className="input-field border-theatre-teal" 
                onChange={e => setFormData({...formData, venue: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">City</label>
              <input type="text" className="input-field border-theatre-teal" required 
                onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Synopsis / Description</label>
            <textarea className="input-field border-theatre-teal h-28 resize-none rounded-2xl" 
              onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Box Office Link</label>
            <input type="url" className="input-field border-theatre-teal" 
              onChange={e => setFormData({...formData, ticketLink: e.target.value})} />
          </div>

          <div className="pt-8">
            <button type="submit" className="btn-primary w-full text-lg py-4">Publish Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
