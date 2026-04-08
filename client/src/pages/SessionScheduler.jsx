import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RoleContext } from '../App';
import { CalendarDays, Clock, Video, PlusCircle, CheckCircle } from 'lucide-react';

import { api } from '../api';

const SessionScheduler = () => {
  const { role, userId } = useContext(RoleContext);
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ topic: '', date: '', mentorId: '', menteeId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [role, userId]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
       const response = await axios.get(api.sessions);
      let filtered = response.data;
      
      if (role === 'mentor') {
        filtered = filtered.filter(s => s.mentorId === userId);
      } else if (role === 'mentee') {
        filtered = filtered.filter(s => s.menteeId === userId);
      }
      // Admin sees all
      
      setSessions(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      // Default to currentUser as one side, and target input for the other.
      const payload = {
        ...newSession,
        mentorId: role === 'mentor' ? userId : (role === 'admin' ? newSession.mentorId : 1), // simplified demo defaults
        menteeId: role === 'mentee' ? userId : (role === 'admin' ? newSession.menteeId : 3), // simplified demo defaults
      };
      
      await axios.post(api.sessions, payload);
      setNewSession({ topic: '', date: '', mentorId: '', menteeId: '' });
      fetchSessions();
      alert('Session scheduled!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Session Scheduler
          </h1>
          <p className="text-textMuted mt-2">Manage upcoming mentorship meetings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scheduler Form */}
        <div className="card h-fit sticky top-24 shadow-xl border-t-[3px] border-t-primary lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-400" /> Book a Session
          </h2>
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Topic / Agenda</label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g. Code Review, Career Path..."
                value={newSession.topic}
                onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="input"
                value={newSession.date}
                onChange={(e) => setNewSession({...newSession, date: e.target.value})}
              />
            </div>

            {role === 'admin' && (
              <>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-textMuted mb-1">Mentor ID</label>
                    <input type="number" required className="input" value={newSession.mentorId} onChange={(e) => setNewSession({...newSession, mentorId: parseInt(e.target.value)})} />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-textMuted mb-1">Mentee ID</label>
                    <input type="number" required className="input" value={newSession.menteeId} onChange={(e) => setNewSession({...newSession, menteeId: parseInt(e.target.value)})} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="w-full btn-primary py-3 font-bold mt-2 hover:shadow-primary/50">
              Schedule Now
            </button>
          </form>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" /> Upcoming Meetings
            </h2>
            
            {loading ? (
               <div className="animate-pulse flex flex-col gap-4">
                 {[1,2].map(i => <div key={i} className="h-24 bg-surface/50 rounded-xl" />)}
               </div>
            ) : sessions.filter(s => new Date(s.date) >= new Date()).length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-12 text-center text-textMuted border-dashed">
                <CalendarDays className="h-12 w-12 text-surface mb-2 opacity-50" />
                <p>No upcoming sessions are currently scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.filter(s => new Date(s.date) >= new Date()).map((session) => (
                  <div key={session.id} className="card group hover:border-primary/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Video className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{session.topic}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <p className="text-sm text-textMuted flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {session.time || new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {session.duration && (
                            <p className="text-sm text-textMuted flex items-center gap-1">
                              <PlusCircle className="h-3 w-3 text-accent" />
                              {session.duration} mins • <span className="text-accent/80">{session.mode || 'Virtual'}</span>
                            </p>
                          )}
                          {session.estimatedCost && (
                            <p className="text-sm font-bold text-emerald-400">
                              ${session.estimatedCost}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="self-end md:self-center">
                       <a 
                        href={session.meetingLink || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`btn-primary text-xs h-9 px-4 flex items-center gap-2 ${!session.meetingLink && 'opacity-50 pointer-events-none'}`}
                       >
                         <Video className="h-4 w-4" /> Join Session
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-textMuted">
              <CheckCircle className="h-5 w-5 text-emerald-500/50" /> Completed Sessions
            </h2>
            
            <div className="space-y-4">
              {sessions.filter(s => new Date(s.date) < new Date()).length === 0 ? (
                 <p className="text-sm text-textMuted px-6 italic">No completed sessions yet.</p>
              ) : (
                sessions.filter(s => new Date(s.date) < new Date()).map((session) => (
                  <div key={session.id} className="card-compact group border border-white/5 bg-surface/30 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 opacity-70 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all">
                     <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{session.topic}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <p className="text-xs text-textMuted flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">Paid ${session.estimatedCost}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400/60 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 self-end md:self-center">Archive</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SessionScheduler;
