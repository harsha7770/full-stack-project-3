import { useContext } from 'react';
import { RoleContext } from '../App';
import { GraduationCap, ArrowRight, Star, Users, Brain, Target, CheckCircle, Sparkles } from 'lucide-react';

const Landing = ({ onAuthClick }) => {
  return (
    <div className="animate-in fade-in duration-1000 w-full min-h-screen flex flex-col items-center">
      {/* Header with Nav */}
      <header className="w-full max-w-7xl px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tighter">
            MentorConnect
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onAuthClick('login')}
            className="text-sm font-bold text-textMuted hover:text-white transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => onAuthClick('register')}
            className="btn-primary py-2.5 px-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 w-full max-w-7xl px-8 flex flex-col items-center justify-center text-center py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
           <Sparkles className="h-3 w-3" /> The platform for future leaders.
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter max-w-4xl">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400">Mentor Hub</span>
        </h1>
        
        <p className="text-lg md:text-xl text-textMuted max-w-2xl mb-12 leading-relaxed">
          The ultimate mentorship destination. Connect with industry leaders, scale your potential, and accelerate your professional growth within minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <button 
            onClick={() => onAuthClick('register')}
            className="flex-1 btn-primary py-5 px-10 text-sm font-black flex items-center justify-center gap-2 shadow-2xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all group"
          >
            Get Started Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onAuthClick('login')}
            className="flex-1 py-5 px-10 rounded-2xl bg-white/5 border border-white/10 text-sm font-black hover:bg-white/10 transition-all active:scale-95"
          >
            Sign In
          </button>
        </div>

        {/* Floating Social Proof or Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full max-w-5xl">
           <div className="p-8 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-md">
              <Brain className="h-10 w-10 text-blue-400 mb-6" />
              <h3 className="text-lg font-bold mb-3">Expert Guidance</h3>
              <p className="text-sm text-textMuted leading-relaxed">Get personalized insights from top 1% industry professionals across tech and design.</p>
           </div>
           <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 backdrop-blur-md">
              <Target className="h-10 w-10 text-emerald-400 mb-6" />
              <h3 className="text-lg font-bold mb-3">Career Fast-track</h3>
              <p className="text-sm text-textMuted leading-relaxed">Systematically build your goals and track progress with modern coaching analytics.</p>
           </div>
           <div className="p-8 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-md">
              <Users className="h-10 w-10 text-indigo-400 mb-6" />
              <h3 className="text-lg font-bold mb-3">Vibrant Network</h3>
              <p className="text-sm text-textMuted leading-relaxed">Join a community of 50k+ active learners and mentors scaling the world together.</p>
           </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="w-full py-12 border-t border-white/5 text-center px-8">
         <p className="text-xs text-textMuted">Ready to scale? Join MentorConnect platform today. © 2026</p>
      </footer>
    </div>
  );
};

export default Landing;
