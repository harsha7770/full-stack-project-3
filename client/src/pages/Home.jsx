import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { RoleContext } from '../App';
import { Users, BookOpen, Target, Sparkles, Activity, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { api } from '../api';

const Home = () => {
  const { role, userId } = useContext(RoleContext);
  const [stats, setStats] = useState({ 
    mentees: 0, 
    mentors: 0, 
    sessions: 0, 
    activeSessions: 0, 
    completedSessions: 0, 
    rating: 4.9, 
    conversionRate: 85 
  });
  const [userSessions, setUserSessions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, sessionsRes] = await Promise.all([
          axios.get(api.users),
          axios.get(api.sessions)
        ]);
        
        const mentorsList = usersRes.data.filter(u => u.role === 'mentor');
        const menteesList = usersRes.data.filter(u => u.role === 'mentee');
        const allSessions = sessionsRes.data;
        const active = allSessions.filter(s => s.status === 'scheduled').length;
        const complete = allSessions.filter(s => s.status === 'completed').length;
        
        setStats({ 
          mentees: menteesList.length, 
          mentors: mentorsList.length, 
          sessions: allSessions.length,
          activeSessions: active,
          completedSessions: complete,
          rating: 4.9,
          conversionRate: Math.round((complete / allSessions.length) * 100) || 85
        });
        
        // Filter sessions for the current user
        const filtered = sessionsRes.data.filter(s => 
          (role === 'mentor' && s.mentorId === userId) || 
          (role === 'mentee' && s.menteeId === userId) ||
          (role === 'admin')
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setUserSessions(filtered.slice(0, 3)); // show top 3 upcoming
        setMentors(mentorsList);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load stats", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [role, userId]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20">
      
      {/* Hero Section - Conditional for Mentee/Mentor */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-surface border border-white/5 p-10 md:p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-emerald-500/10 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-primary-light text-xs font-bold uppercase tracking-widest mb-6">
             <Sparkles className="h-3 w-3" /> Welcome Back, {role}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            {role === 'mentee' ? (
              <>Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Career Path</span></>
            ) : (
              <>Design your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Success Story</span></>
            )}
          </h1>
          <p className="text-lg text-textMuted mb-10 max-xl">
            {role === 'admin' 
              ? "Scale the community, optimize mentor performance, and drive impactful growth." 
              : role === 'mentor' 
              ? "Track your session performance, manage your connections, and empower your mentees."
              : "Access top industry expertise, book personalized sessions, and stay on track with your goals."}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/mentors" className="btn-primary py-4 px-8 text-sm font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
              {role === 'mentee' ? "Book New Session" : "Platform Dashboard"}
            </Link>
            <Link to="/sessions" className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-sm font-bold transition-all flex items-center gap-2">
              My Appointments <Activity className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {role === 'mentee' ? (
        /* MENTEE SPECIFIC DASHBOARD CONTENT */
        <div className="space-y-12">
          {/* Mentee Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-compact p-8 bg-surface/40 border-white/5 flex items-center justify-between group overflow-hidden relative">
               <div className="absolute right-0 top-0 h-full w-2 bg-blue-500 opacity-20" />
               <div>
                  <p className="text-[10px] font-bold uppercase text-textMuted tracking-extra-widest">Total Sessions Booked</p>
                  <h4 className="text-4xl font-black text-white">{loading ? '...' : userSessions.length}</h4>
               </div>
               <Activity className="h-10 w-10 text-blue-500/40 group-hover:rotate-12 transition-transform" />
            </div>

            <div className="card-compact p-8 bg-surface/40 border-white/5 flex items-center justify-between group overflow-hidden relative">
               <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500 opacity-20" />
               <div>
                  <p className="text-[10px] font-bold uppercase text-textMuted tracking-extra-widest">Completed Milestones</p>
                  <h4 className="text-4xl font-black text-white">
                    {loading ? '...' : userSessions.filter(s => new Date(s.date) < new Date()).length}
                  </h4>
               </div>
               <CheckCircle className="h-10 w-10 text-emerald-500/40 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions / Discover Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" /> Recommended Mentors
                </h2>
                <Link to="/mentors" className="text-xs text-primary font-bold hover:underline">View All Network</Link>
              </div>

              {/* Discovery Section (Dynamic) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {loading ? (
                   [1,2].map(i => <div key={i} className="h-40 rounded-3xl bg-surface/20 animate-pulse" />)
                 ) : mentors.length > 0 ? (
                   // Show some of the new/top mentors
                   mentors.slice(0, 4).map((m) => (
                     <div key={m.id} className="card bg-surface/30 p-6 flex flex-col gap-4 border border-white/10 hover:border-primary/50 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                             <div className="h-full w-full rounded-full bg-surface flex items-center justify-center font-bold text-lg">
                               {m.name.charAt(0)}
                             </div>
                          </div>
                          <div>
                             <h3 className="font-bold text-white group-hover:text-primary transition-colors">{m.name}</h3>
                             <p className="text-[10px] text-textMuted uppercase font-bold tracking-tighter">{m.expertise?.[0] || 'Expert'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-textMuted line-clamp-1">{m.bio}</p>
                        <Link to="/mentors" className="text-xs font-black text-primary uppercase flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-2">
                           Schedule Session <Activity className="h-3 w-3" />
                        </Link>
                     </div>
                   ))
                 ) : (
                   <p className="text-textMuted text-sm italic">No mentors available yet.</p>
                 )}
              </div>

            </div>

            {/* Upcoming Schedule Sidebar for Mentee */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" /> Your Next Focus
              </h2>
              <div className="space-y-4">
                {userSessions.filter(s => new Date(s.date) >= new Date()).slice(0, 2).map((session) => (
                  <div key={session.id} className="card-compact p-5 bg-surface/50 border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/20">
                        <span className="text-[8px] font-black text-primary uppercase">{new Date(session.date).toLocaleString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-black leading-none">{new Date(session.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{session.topic}</h4>
                        <p className="text-xs text-textMuted">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.mode}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {userSessions.length === 0 && (
                   <div className="py-12 border border-dashed border-white/10 rounded-2xl text-center text-textMuted">
                      <p className="text-xs px-10">You have no upcoming sessions. Start learning now!</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

      ) : (
        /* MENTOR / ADMIN ANALYTICS DASHBOARD CONTENT (Same as what you built) */
        <div className="space-y-12">
          {/* Modern Dashboard Stats */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" /> Real-time Analytics
              </h2>
              <span className="text-xs text-textMuted bg-white/5 px-3 py-1 rounded-full border border-white/5">Updated live</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card group bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">+12%</span>
                </div>
                <p className="text-textMuted text-xs font-bold uppercase tracking-wider">Total Mentors</p>
                <h3 className="text-4xl font-black mt-1 leading-none">{loading ? '...' : stats.mentors}</h3>
                <p className="text-[10px] text-textMuted mt-4 border-t border-white/5 pt-2 italic">Joined this month</p>
              </div>

              <div className="card group bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">Active</span>
                </div>
                <p className="text-textMuted text-xs font-bold uppercase tracking-wider">Total Sessions</p>
                <h3 className="text-4xl font-black mt-1 leading-none">{loading ? '...' : stats.sessions}</h3>
                <p className="text-[10px] text-textMuted mt-4 border-t border-white/5 pt-2 italic">{stats.activeSessions} scheduled currently</p>
              </div>

              <div className="card group bg-surface/50 hover:bg-surface transition-colors">
                 <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Target className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">5.0 ★</span>
                </div>
                <p className="text-textMuted text-xs font-bold uppercase tracking-wider">Total Mentees</p>
                <h3 className="text-4xl font-black mt-1 leading-none">{loading ? '...' : stats.mentees}</h3>
                <p className="text-[10px] text-textMuted mt-4 border-t border-white/5 pt-2 italic">Growth at premium rate</p>
              </div>

              <div className="card group bg-indigo-600/10 border-indigo-500/20 hover:border-indigo-500/40 transition-all">
                 <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">Top 1%</span>
                </div>
                <p className="text-textMuted text-xs font-bold uppercase tracking-wider">Platform Rating</p>
                <h3 className="text-4xl font-black mt-1 leading-none">{stats.rating}</h3>
                <p className="text-[10px] text-textMuted mt-4 border-t border-white/5 pt-2 italic">Based on 1.2k reviews</p>
              </div>
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="card flex flex-row items-center justify-between p-8 bg-gradient-to-r from-emerald-600/10 to-transparent border-white/10 group overflow-hidden relative">
                  <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500 opacity-20" />
                  <div>
                     <p className="text-[10px] font-bold uppercase text-textMuted tracking-extra-widest">Active Sessions</p>
                     <h4 className="text-3xl font-black text-white">{stats.activeSessions}</h4>
                  </div>
                  <Activity className="h-8 w-8 text-emerald-500/40 group-hover:animate-pulse" />
               </div>

               <div className="card flex flex-row items-center justify-between p-8 bg-gradient-to-r from-blue-600/10 to-transparent border-white/10 group overflow-hidden relative">
                  <div className="absolute right-0 top-0 h-full w-2 bg-blue-500 opacity-20" />
                  <div>
                     <p className="text-[10px] font-bold uppercase text-textMuted tracking-extra-widest">Completed Sessions</p>
                     <h4 className="text-3xl font-black text-white">{stats.completedSessions}</h4>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500/40 group-hover:animate-pulse" />
               </div>

               <div className="card flex flex-row items-center justify-between p-8 bg-gradient-to-r from-indigo-600/10 to-transparent border-white/10 group overflow-hidden relative">
                  <div className="absolute right-0 top-0 h-full w-2 bg-indigo-500 opacity-20" />
                  <div>
                     <p className="text-[10px] font-bold uppercase text-textMuted tracking-extra-widest">Conversion Rate</p>
                     <h4 className="text-3xl font-black text-white">{stats.conversionRate}%</h4>
                  </div>
                  <Activity className="h-8 w-8 text-indigo-500/40 group-hover:animate-pulse" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sessions Section */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" /> Upcoming Schedule
                  </h2>
                  <Link to="/sessions" className="text-xs text-primary font-bold hover:underline">View Calendar</Link>
               </div>

               <div className="space-y-4">
                  {userSessions.map((session) => (
                    <div key={session.id} className="card-compact p-5 bg-surface/50 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all hover:-translate-y-1">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-surface flex flex-col items-center justify-center border border-white/10 shadow-lg group-hover:border-primary/20">
                          <span className="text-[10px] font-black text-primary uppercase">{new Date(session.date).toLocaleString('en-US', { month: 'short' })}</span>
                          <span className="text-xl font-black leading-none">{new Date(session.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-white group-hover:text-primary transition-colors">{session.topic}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-textMuted flex items-center gap-1">
                              <Activity className="h-3 w-3" /> {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <p className="text-xs text-accent font-bold uppercase tracking-tighter">{session.mode || 'Virtual'}</p>
                          </div>
                        </div>
                      </div>
                      <Link to="/sessions" className="p-3 rounded-xl bg-white/5 text-textMuted hover:text-white transition-colors group-hover:bg-primary/10">
                         <BookOpen className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
               </div>
            </div>

            {/* Informational Section */}
            <div className="space-y-6">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <Target className="h-5 w-5 text-blue-400" /> Platform Insights
               </h2>
               <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                  <Sparkles className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-4 pr-10">Mentorship Excellence is our priority.</h3>
                  <p className="text-sm text-textMuted mb-6 leading-relaxed">
                    98% of mentees on our platform have successfully transitions to high-growth roles within 6 months of active coaching.
                  </p>
                  <div className="flex items-center gap-4">
                     <p className="text-xs text-emerald-400 font-bold">+2k Success Stories</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
