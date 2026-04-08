import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, LineChart, Shield, User, GraduationCap } from 'lucide-react';
import { RoleContext } from '../App';

const Navbar = () => {
  const { role, userName, setIsAuthenticated, setShowAuth, setUserId, setRole, setUserName } = useContext(RoleContext);
  const location = useLocation();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setShowAuth(false);
    setUserId(null);
    setRole(null);
    setUserName('');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Mentors', path: '/mentors', icon: Users },
    { name: 'Sessions', path: '/sessions', icon: CalendarDays },
    { name: 'Progress', path: '/progress', icon: LineChart },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            MentorConnect
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'text-textMuted hover:text-text hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-4 bg-surface py-1.5 px-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-full border border-white/10 bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-sm">
                 {userName.charAt(0)}
               </div>
               <div className="hidden lg:flex flex-col">
                 <span className="text-sm font-semibold leading-tight">{userName}</span>
                 <span className="text-[10px] text-textMuted uppercase tracking-wider">{role}</span>
               </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
