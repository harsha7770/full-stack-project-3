import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RoleContext } from '../App';
import { Users, Code, Loader2, Sparkles, HandshakeIcon, Search, SlidersHorizontal, X, Calendar, Clock, Link as LinkIcon, Briefcase } from 'lucide-react';

import { api } from '../api';

const MentorList = () => {
  const { role, userId } = useContext(RoleContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter States
  const [skillSearch, setSkillSearch] = useState('');
  const [expFilter, setExpFilter] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    date: '',
    time: '',
    duration: '30',
    mode: 'Virtual',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    selectedTargetMenteeId: '' // For admin manual matching
  });

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = role === 'admin' ? api.users : role === 'mentee' ? api.mentors : api.mentees;
      const response = await axios.get(endpoint);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    let filtered = [...users];
    
    if (skillSearch) {
      filtered = filtered.filter(u => 
        (u.expertise || u.interests || []).some(skill => 
          skill.toLowerCase().includes(skillSearch.toLowerCase())
        )
      );
    }

    if (expFilter) {
      filtered = filtered.filter(u => (u.experience || 0) >= parseInt(expFilter));
    }

    setFilteredUsers(filtered);
  };

  const handleResetFilters = () => {
    setSkillSearch('');
    setExpFilter('');
    setFilteredUsers(users);
  };

  const openConnectModal = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const closeConnectModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  const calculateCost = () => {
    if (!selectedMentor || !selectedMentor.hourlyRate) return 0;
    return Math.round((selectedMentor.hourlyRate / 60) * parseInt(formData.duration));
  };

  const handleConnectSubmit = async (e) => {
    if(e) e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        mentorId: role === 'mentee' ? selectedMentor.id : userId,
        menteeId: role === 'mentee' ? userId : selectedMentor.id,
        ...formData,
        estimatedCost: calculateCost()
      };
      
      if(role === 'admin') {
         const { selectedTargetMenteeId } = formData;
         const adminPayload = {
            mentorId: selectedMentor.role === 'mentor' ? selectedMentor.id : null,
            menteeId: selectedTargetMenteeId || (selectedMentor.role === 'mentee' ? selectedMentor.id : null)
         };
         
         if(!adminPayload.mentorId || !adminPayload.menteeId) {
            alert('Admin: Please select both a mentor and a mentee.');
            setActionLoading(false);
            return;
         }
         
         await axios.post(api.match, adminPayload);
         alert('Relationship manually established by Admin.');
         closeConnectModal();
         return;
      }

      await axios.post(api.match, payload);
      alert(`Success! Connection established with ${selectedMentor.name} and your session on ${formData.topic} is booked for ${formData.date} at ${formData.time}. Total estimated cost: $${calculateCost()}`);
      closeConnectModal();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to connect. Might be already connected.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-textMuted animate-pulse">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            {role === 'admin' ? 'User Directory' : role === 'mentee' ? 'Find a Mentor' : 'Available Mentees'}
          </h1>
          <p className="text-textMuted">
            {role === 'admin' ? 'Manage and match users across the platform.' : 'Browse profiles and establish professional connections to boost your growth.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-surface/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
            <input 
              type="text" 
              placeholder="Search skill (e.g. React)" 
              className="bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none w-48 transition-all"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />
          </div>
          <div className="relative text-sm">
            <select 
              className="bg-background/50 border border-white/10 rounded-xl px-4 py-2 appearance-none outline-none focus:ring-2 focus:ring-primary/50 text-textMuted pr-8 cursor-pointer"
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
            >
              <option value="">Experience</option>
              <option value="2">2+ Years</option>
              <option value="5">5+ Years</option>
              <option value="10">10+ Years</option>
            </select>
          </div>
          <button 
            onClick={handleApplyFilters}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> Apply
          </button>
          <button 
            onClick={handleResetFilters}
            className="text-textMuted hover:text-white text-sm transition-colors px-2"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div key={u.id} className="card group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
            <div className={`absolute top-0 right-0 p-3 rounded-bl-xl font-semibold text-xs uppercase tracking-wider ${u.role === 'mentor' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {u.role}
            </div>
            
            <div className="mb-4 mt-2">
               <div className="flex items-start justify-between">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] mb-4">
                      <div className="h-full w-full rounded-full bg-surface flex items-center justify-center font-bold text-xl">
                          {u.name.charAt(0)}
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {u.experience && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full uppercase tracking-tighter">
                         <Briefcase className="h-3 w-3" /> {u.experience} yrs exp
                      </div>
                    )}
                    {u.hourlyRate && (
                      <div className="text-sm font-bold text-emerald-400">
                        ${u.hourlyRate}<span className="text-[10px] text-textMuted lowercase font-normal">/hr</span>
                      </div>
                    )}
                  </div>
               </div>
              <h3 className="text-xl font-bold">{u.name}</h3>
              <p className="text-sm text-textMuted mt-1 line-clamp-2">{u.bio || u.goals || 'Passionate professional ready to connect.'}</p>
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <h4 className="text-xs uppercase text-textMuted font-bold mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" /> {u.role === 'mentor' ? 'Expertise' : 'Interests'}
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {(u.expertise || u.interests || ['General']).map((skill, idx) => (
                  <span key={idx} className="bg-white/5 text-xs text-blue-300 px-2 py-1 rounded-md border border-white/5">
                    {skill}
                  </span>
                ))}
              </div>

              {((role === 'mentee' && u.role === 'mentor') || (role === 'admin') || (role === 'mentor' && u.role === 'mentee')) && (
                <button
                  disabled={actionLoading}
                  onClick={() => openConnectModal(u)}
                  className="w-full btn-primary flex items-center justify-center gap-2 group-hover:bg-primary group-hover:scale-[1.02] transition-all"
                >
                  <HandshakeIcon className="h-4 w-4" /> 
                  {role === 'admin' ? 'Manage Connection' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-20 text-center text-textMuted border border-dashed border-white/10 rounded-2xl bg-surface/50">
            <div className="max-w-xs mx-auto">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-1">No users found</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative p-8">
              <button 
                onClick={closeConnectModal}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                  <HandshakeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Request Connection</h2>
                  <p className="text-textMuted text-sm">Fine-tune your session details and confirm booking.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <form onSubmit={handleConnectSubmit} className="md:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-textMuted mb-2">
                       {role === 'admin' ? (selectedMentor?.role === 'mentor' ? 'Confirm Mentor' : 'Assign to Mentor') : 'Select Mentor'}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
                      <select 
                        className="w-full bg-background/50 border border-white/10 rounded-xl px-11 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
                        value={selectedMentor?.id}
                        onChange={(e) => setSelectedMentor(users.find(u => u.id === parseInt(e.target.value)))}
                      >
                         <option value="" disabled>Select User</option>
                        {users.filter(u => u.role === 'mentor').map(m => (
                          <option key={m.id} value={m.id}>{m.name} (${m.hourlyRate}/hr)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {role === 'admin' && (
                    <div>
                      <label className="block text-sm font-semibold text-textMuted mb-2">
                         {selectedMentor?.role === 'mentee' ? 'Confirm Mentee' : 'Assign to Mentee'}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
                        <select 
                          className="w-full bg-background/50 border border-white/10 rounded-xl px-11 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
                          value={formData.selectedTargetMenteeId}
                          onChange={(e) => setFormData({...formData, selectedTargetMenteeId: parseInt(e.target.value)})}
                        >
                          <option value="" disabled>Select Mentee</option>
                          {users.filter(u => u.role === 'mentee').map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-textMuted mb-2">Topic of Discussion</label>
                      <div className="relative">
                        <Code className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
                        <input 
                          type="text" 
                          required
                          className="w-full bg-background/50 border border-white/10 rounded-xl px-11 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-textMuted/50"
                          placeholder="e.g. System Design Interview"
                          value={formData.topic}
                          onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-textMuted mb-2">Date</label>
                      <input 
                        type="date" 
                        required
                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-textMuted mb-2">Time</label>
                      <input 
                        type="time" 
                        required
                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-textMuted mb-2">Duration</label>
                      <select 
                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      >
                        <option value="30">30 Mins</option>
                        <option value="60">1 Hour</option>
                        <option value="90">1.5 Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-textMuted mb-2">Mode</label>
                      <select 
                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                        value={formData.mode}
                        onChange={(e) => setFormData({...formData, mode: e.target.value})}
                      >
                        <option value="Virtual">Virtual</option>
                        <option value="Phone">Phone Call</option>
                        <option value="In Person">In Person</option>
                      </select>
                    </div>

                    {formData.mode !== 'In Person' && (
                       <div className="col-span-2">
                        <label className="block text-sm font-semibold text-textMuted mb-2">{formData.mode === 'Virtual' ? 'Meeting Link' : 'Phone Number'}</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
                          <input 
                            type="text" 
                            required
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-11 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-xs"
                            value={formData.meetingLink}
                            onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>

                {/* Summary Box */}
                <div className="space-y-6">
                  <div className="bg-background/40 border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                    <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-4">Session Summary</h3>
                    
                    <div className="space-y-4 flex-grow">
                      <div>
                        <p className="text-[10px] text-textMuted font-bold uppercase">Mentor</p>
                        <p className="font-bold text-white">{selectedMentor?.name}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-[10px] text-textMuted font-bold uppercase">Duration</p>
                          <p className="font-bold text-white">{formData.duration} Mins</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-textMuted font-bold uppercase text-right">Mode</p>
                          <p className="font-bold text-accent text-right">{formData.mode}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 mt-4">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[10px] text-textMuted font-bold uppercase">Estimated Cost</p>
                              <p className="text-3xl font-black text-emerald-400">${calculateCost()}</p>
                           </div>
                           <p className="text-[10px] text-textMuted mb-1 italic">Incl. fees</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <button 
                        onClick={handleConnectSubmit}
                        disabled={actionLoading}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                      >
                        {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm & Pay'}
                      </button>
                      <button 
                        onClick={closeConnectModal}
                        className="w-full py-3 text-xs text-textMuted hover:text-white font-semibold transition-colors"
                      >
                        Cancel Transaction
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorList;
