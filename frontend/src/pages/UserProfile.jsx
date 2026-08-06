import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = loggedInUser.id === id;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        skills: data.skills?.join(', ') || '',
        languages: data.languages?.join(', ') || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s)
      };
      await api.put('/users/profile', updatedData);
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center mt-20 font-serif text-3xl italic text-theatre-gold">Loading...</div>;
  if (!profile) return <div className="text-center mt-20 font-serif text-3xl text-theatre-coral">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-16">
      <div className="playbill-card border-4 border-theatre-gold !rounded-3xl p-8 md:p-12">
        <div className="flex justify-between items-start mb-6">
          <span className="pill-tag bg-theatre-coral text-theatre-offwhite">{profile.role.replace('_', ' ').toUpperCase()}</span>
          {isOwner && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-sm font-display font-bold uppercase tracking-wider text-theatre-teal underline decoration-2 hover:text-theatre-coral transition">Edit Profile</button>
          )}
        </div>
        
        <div className="text-center pb-8 border-b-4 border-dashed border-theatre-teal/20">
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-wide text-theatre-teal mb-3">{profile.name}</h1>
          <p className="font-display font-bold uppercase tracking-widest text-theatre-teal/60">📍 {profile.city}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-8 space-y-6 font-sans">
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Bio</label>
              <textarea className="input-field border-theatre-teal h-32 resize-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Skills (comma separated)</label>
              <input type="text" className="input-field border-theatre-teal" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Languages (comma separated)</label>
              <input type="text" className="input-field border-theatre-teal" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary py-3 px-6 text-sm">Save Profile</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary py-3 px-6 text-sm bg-theatre-offwhite">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="py-10 font-sans space-y-12">
            {profile.bio && (
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-widest text-theatre-teal mb-4 text-center">About</h3>
                <p className="text-theatre-teal/80 leading-relaxed text-lg text-justify font-medium max-w-2xl mx-auto">{profile.bio}</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8">
              {profile.skills?.length > 0 && (
                <div className="bg-theatre-gold/20 p-6 border-2 border-theatre-gold rounded-2xl">
                  <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-4 text-theatre-teal">Special Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <span key={i} className="pill-tag bg-theatre-offwhite text-theatre-teal border-theatre-teal px-3 py-1">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.languages?.length > 0 && (
                <div className="bg-theatre-gold/20 p-6 border-2 border-theatre-gold rounded-2xl">
                  <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-4 text-theatre-teal">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang, i) => (
                      <span key={i} className="pill-tag bg-theatre-teal text-theatre-gold border-theatre-teal px-3 py-1">{lang}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {profile.pastProductions?.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-widest text-theatre-teal mb-6 text-center border-b-2 border-theatre-gold/30 pb-2">Past Productions</h3>
                <div className="space-y-4">
                  {profile.pastProductions.map((prod, i) => (
                    <div key={i} className="flex justify-between items-center bg-theatre-offwhite border-2 border-theatre-teal/20 p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,61,62,0.1)]">
                      <div>
                        <h4 className="font-serif font-black text-xl text-theatre-teal">{prod.playTitle}</h4>
                        <p className="text-xs font-display font-bold uppercase tracking-wider text-theatre-teal/60 mt-1">{prod.groupName} • {prod.year}</p>
                      </div>
                      <span className="pill-tag bg-theatre-pink">{prod.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
