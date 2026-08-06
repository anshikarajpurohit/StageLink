import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateRecruitmentPost = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({ 
    role: '', description: '', city: '' 
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recruitment', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create casting call');
    }
  };

  if (user.role !== 'theatre_group') {
    return <div className="text-center mt-20 font-serif text-3xl text-theatre-gold">Only Theatre Groups can post casting calls.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-16">
      <div className="playbill-card border-theatre-teal bg-theatre-gold !rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-serif font-black text-theatre-teal mb-4">Post a Casting Call</h2>
          <span className="pill-tag bg-theatre-coral text-theatre-offwhite border-theatre-black">Talent Search</span>
        </div>
        
        {error && <div className="bg-red-50 text-red-800 p-3 mb-6 rounded-xl border-2 border-red-200 text-sm font-sans font-bold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Role Name</label>
            <input type="text" className="input-field border-theatre-teal" required 
              placeholder="e.g. Lead Actor (Male, 25-35) or Set Designer"
              onChange={e => setFormData({...formData, role: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">City</label>
            <input type="text" className="input-field border-theatre-teal" required 
              onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Role Description / Requirements</label>
            <textarea className="input-field border-theatre-teal h-32 resize-none rounded-2xl" required
              onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="pt-8">
            <button type="submit" className="btn-primary w-full text-lg py-4">Publish Casting Call</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecruitmentPost;
