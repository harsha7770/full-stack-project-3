import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RoleContext } from '../App';
import { LineChart, Trophy, ArrowRight, Target, NotebookPen, ShieldAlert } from 'lucide-react';

import { api } from '../api';

const ProgressTracker = () => {
  const { role, userId } = useContext(RoleContext);
  const [progress, setProgress] = useState([]);
  const [logDescription, setLogDescription] = useState('');
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(role === 'mentee' ? userId : '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'mentee') fetchMentees();
    fetchProgress();
  }, [role, userId, selectedMentee]);

  const fetchMentees = async () => {
    try {
       const resp = await axios.get(api.mentees);
      setMentees(resp.data);
      if(resp.data.length > 0 && !selectedMentee) setSelectedMentee(resp.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const targetId = role === 'mentee' ? userId : selectedMentee;
      const response = await axios.get(`${api.progress}${targetId ? `?menteeId=${targetId}` : ''}`);
      setProgress(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      const targetId = role === 'mentee' ? userId : selectedMentee;
      await axios.post(api.progress, {
        description: logDescription,
        menteeId: targetId
      });
      setLogDescription('');
      fetchProgress();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add progress');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2 mb-2">
            <LineChart className="h-8 w-8 text-emerald-400" />
            Development Tracker
          </h1>
          <p className="text-textMuted">Log milestones, document insights, and monitor career trajectory.</p>
        </div>

        {role !== 'mentee' && (
           <div className="bg-surface p-2 rounded-xl border border-white/10 flex items-center gap-3">
             <Target className="h-5 w-5 text-textMuted ml-2" />
             <select 
               className="bg-background outline-none text-sm p-2 rounded-lg cursor-pointer"
               value={selectedMentee}
               onChange={(e) => setSelectedMentee(parseInt(e.target.value))}
             >
               <option value="" disabled>Select Mentee to view</option>
               {mentees.map(m => (
                 <option key={m.id} value={m.id}>{m.name}</option>
               ))}
             </select>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Progress List */}
        <div className="md:col-span-8 space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/50 before:via-white/5 before:to-transparent">
          {loading ? (
             <div className="animate-pulse space-y-4">
                {[1,2].map(i => <div key={i} className="h-24 bg-surface/50 rounded-xl ml-12" />)}
             </div>
          ) : progress.length === 0 ? (
             <div className="ml-12 p-8 text-center text-textMuted bg-surface/30 rounded-xl border border-dashed border-white/10">
               No progress logged yet. Time to achieve something great!
             </div>
          ) : (
             progress.map((item, idx) => (
                <div key={item.id} className="relative flex items-center mb-6 pl-12 group">
                  {/* Timeline bubble */}
                  <div className="absolute left-1.5 h-7 w-7 bg-surface border-2 border-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <Trophy className="h-3 w-3 text-emerald-400" />
                  </div>
                  
                  {/* Content Card */}
                  <div className="card w-full p-5 hover:border-emerald-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors duration-300">Milestone Reached</h4>
                      <span className="text-xs text-textMuted bg-background px-2 py-1 rounded-md">
                        {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-textMuted leading-relaxed">{item.description}</p>
                  </div>
                </div>
             ))
          )}
        </div>

        {/* Add Progress Sticky sidebar */}
        <div className="md:col-span-4">
           {((role === 'mentee') || (role === 'mentor' && selectedMentee)) ? (
             <div className="card sticky top-24 border-t-[3px] border-t-emerald-500 shadow-xl shadow-emerald-500/5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <NotebookPen className="h-5 w-5 text-emerald-400" /> Log Update
                </h3>
                <form onSubmit={handleAddProgress}>
                  <textarea
                    required
                    value={logDescription}
                    onChange={(e) => setLogDescription(e.target.value)}
                    placeholder="E.g., Finished the advanced React concepts module..."
                    className="input min-h-[120px] resize-none mb-4"
                  />
                  <button type="submit" className="w-full btn-primary bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 flex gap-2">
                    Submit Entry <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
             </div>
           ) : role === 'admin' && (
              <div className="card bg-surface/50 border-orange-500/20 sticky top-24">
                <ShieldAlert className="h-8 w-8 text-orange-400 mb-2" />
                <h3 className="font-bold text-orange-300">Admin View Mode</h3>
                <p className="text-sm text-textMuted mt-2">Log updates are disabled in Admin view to maintain record integrity.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
