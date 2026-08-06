import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const GroupProfile = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupRes, actorsRes] = await Promise.all([
          api.get(`/groups/${id}`),
          api.get('/users/actors').catch(() => ({ data: [] }))
        ]);
        setGroup(groupRes.data);
        setActors(actorsRes.data);
        setFormData({
          description: groupRes.data.description || '',
          members: groupRes.data.members?.join(', ') || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFollow = async () => {
    try {
      const { data } = await api.post(`/groups/${id}/follow`);
      setGroup(data);
    } catch (err) {
      if (err.response?.status === 401) alert("Please log in to follow groups.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        description: formData.description,
        members: formData.members.split(',').map(s => s.trim()).filter(s => s)
      };
      const { data } = await api.put(`/groups/${id}`, updatedData);
      setGroup(data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center mt-20 font-serif text-3xl italic text-theatre-gold">Drawing the curtains...</div>;
  if (!group) return <div className="text-center mt-20 font-serif text-3xl text-theatre-coral">Group not found</div>;

  const isOwner = loggedInUser.id === group.ownerId;

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-16">
      <div className="playbill-card border-4 border-theatre-gold !rounded-3xl p-8 md:p-12">
        <div className="flex justify-between items-start mb-6">
          <span className="pill-tag bg-theatre-coral text-theatre-offwhite border-theatre-black">Theatre Company</span>
          <div className="flex items-center gap-4">
            {isOwner && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-sm font-display font-bold uppercase tracking-wider text-theatre-teal underline decoration-2 hover:text-theatre-coral transition mr-2">Edit Profile</button>
            )}
            <span className="text-sm font-display font-bold uppercase tracking-wider text-theatre-teal/60">{group.followers?.length || 0} Followers</span>
            {loggedInUser.id && loggedInUser.id !== group.ownerId && (
              <button onClick={handleFollow} className={`btn-primary !px-5 !py-2 !text-xs ${group.followers?.includes(loggedInUser.id) ? '!bg-theatre-teal !text-theatre-gold !shadow-none !translate-y-[4px] !translate-x-[4px]' : ''}`}>
                {group.followers?.includes(loggedInUser.id) ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        
        <div className="text-center pb-10 border-b-4 border-dashed border-theatre-teal/20">
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-wide text-theatre-teal mt-2">{group.name}</h1>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-8 space-y-6 font-sans">
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">About the Company</label>
              <textarea className="input-field border-theatre-teal h-32 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-display font-bold uppercase tracking-wider text-theatre-teal mb-2">Ensemble Members (comma separated)</label>
              <input type="text" className="input-field border-theatre-teal" placeholder="e.g. Aarav Sharma, Priya Patel" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary py-3 px-6 text-sm">Save Profile</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary py-3 px-6 text-sm bg-theatre-offwhite">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="py-10 font-sans">
            <h3 className="font-display font-bold text-2xl uppercase tracking-widest text-theatre-teal mb-6 text-center">About the Company</h3>
            <p className="text-theatre-teal/80 leading-relaxed text-lg text-justify font-medium max-w-2xl mx-auto">
              {group.description || "A celebrated troupe bringing stories to life on the proscenium stage. Passionate about the art of performance and dedication to the craft."}
            </p>
            
            <div className="mt-16 bg-theatre-gold/20 p-8 border-4 border-theatre-gold rounded-2xl">
              <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6 text-center text-theatre-teal">Ensemble Members</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {group.members && group.members.length > 0 ? (
                  group.members.map((member, idx) => {
                    const matchedActor = actors.find(a => a.name.toLowerCase() === member.toLowerCase());
                    return matchedActor ? (
                      <Link key={idx} to={`/profile/${matchedActor._id}`} className="pill-tag bg-theatre-offwhite text-theatre-teal border-theatre-teal hover:bg-theatre-teal hover:text-theatre-gold transition text-sm px-4 py-2 block">
                        {member}
                      </Link>
                    ) : (
                      <span key={idx} className="pill-tag bg-theatre-offwhite text-theatre-teal border-theatre-teal text-sm px-4 py-2">{member}</span>
                    );
                  })
                ) : (
                  <span className="text-theatre-teal/60 font-sans font-medium italic">No ensemble members listed yet.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupProfile;
