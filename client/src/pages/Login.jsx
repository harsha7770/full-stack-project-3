import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { RoleContext } from '../App';
import { Lock, Mail, ArrowRight, Loader2, GraduationCap, User as UserIcon } from 'lucide-react';

import { api } from '../api';

const Login = ({ initialMode = 'login' }) => {
  const { setRole, setUserId, setIsAuthenticated, setUserName } = useContext(RoleContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleSelection, setRoleSelection] = useState('mentee');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [authMode, setAuthMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
     setAuthMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(authMode === 'forgot') {
      setLoading(true);
      setError('');
      try {
        await axios.post(api.forgotPassword, { email });
        setResetSent(true);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to send reset link. Please verify your email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const endpoint = authMode === 'register' ? api.register : api.login;
      const payload = authMode === 'register' 
        ? { email, password, name, role: roleSelection }
        : { email, password };
      const response = await axios.post(endpoint, payload);
      const user = response.data.user;
      
      setRole(user.role);
      setUserId(user.id);
      setUserName(user.name);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${authMode}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
      <div className="card shadow-2xl shadow-primary/10 border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-3 rounded-2xl mb-4 group hover:bg-primary/30 transition-all">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            MentorConnect
          </h2>
          <p className="text-textMuted mt-2 text-center">
            {authMode === 'forgot' ? 'Recover your account details.' : 
             authMode === 'register' ? 'Create a new account to join us.' :
             'Sign in to access your dashboard.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {authMode === 'forgot' && resetSent ? (
          <div className="text-center animate-in fade-in">
             <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
               <Mail className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-bold mb-2">Check your email</h3>
             <p className="text-textMuted mb-6">We've sent a password reset link to {email || 'your email'}.</p>
             <button onClick={() => { setAuthMode('login'); setResetSent(false); }} className="btn-secondary w-full">
               Return to Login
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1.5 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  className="input py-2.5"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1.5 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Address
              </label>
              <input
                type="email"
                required
                className="input py-2.5"
                placeholder="charlie@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {authMode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1.5 flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input py-2.5"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {authMode === 'register' && (
               <div>
                  <label className="block text-sm font-medium text-textMuted mb-1.5">Join As</label>
                  <select
                    className="input py-2.5 bg-background"
                    value={roleSelection}
                    onChange={(e) => setRoleSelection(e.target.value)}
                  >
                    <option value="mentee">Mentee (Looking for guidance)</option>
                    <option value="mentor">Mentor (Sharing my expertise)</option>
                  </select>
               </div>
            )}

            {authMode === 'login' && (
              <div className="flex justify-end pt-1">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('forgot')} 
                  className="text-xs text-primary hover:text-blue-300 transition-colors font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-bold text-base mt-2 flex justify-center gap-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span className="flex items-center gap-2 relative z-10">
                  {authMode === 'forgot' ? 'Send Reset Link' : authMode === 'register' ? 'Create Account' : 'Sign In'} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
            <div className="pt-2 text-center">
              {authMode === 'login' && (
                 <p className="text-sm text-textMuted">
                   Don't have an account?{' '}
                   <button 
                     type="button" 
                     onClick={() => setAuthMode('register')} 
                     className="text-primary font-bold hover:underline ml-1"
                   >
                     Register here
                   </button>
                 </p>
              )}
              {authMode !== 'login' && (
                 <button
                   type="button"
                   className="w-full btn-secondary mt-1 border-white/10"
                   onClick={() => setAuthMode('login')}
                 >
                   Back to Login
                 </button>
              )}
            </div>
          </form>
        )}
        
        {authMode === 'login' && (
          <div className="mt-8 border-t border-white/5 pt-6 text-xs text-center text-textMuted space-y-1">
            <p>Mock Credentials for Testing:</p>
            <p>Mentee: <code className="text-white bg-white/5 px-1 rounded">charlie@example.com</code> / <code className="text-white bg-white/5 px-1 rounded">password123</code></p>
            <p>Admin: <code className="text-white bg-white/5 px-1 rounded">admin@example.com</code> / <code className="text-white bg-white/5 px-1 rounded">admin</code></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
