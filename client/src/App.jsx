import { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MentorList from './pages/MentorList';
import SessionScheduler from './pages/SessionScheduler';
import ProgressTracker from './pages/ProgressTracker';
import Login from './pages/Login';
import Landing from './pages/Landing';

export const RoleContext = createContext();

function App() {
  const [role, setRole] = useState('mentee'); // 'admin', 'mentor', 'mentee'
  const [userId, setUserId] = useState(3); // Default to mentee Charlie (id: 3)

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false); 
  const [authMode, setAuthMode] = useState('login'); 
  const [userName, setUserName] = useState('');

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <RoleContext.Provider value={{ 
      role, setRole, 
      userId, setUserId, 
      isAuthenticated, setIsAuthenticated,
      showAuth, setShowAuth,
      userName, setUserName
    }}>
      <Router>
        <div className="min-h-screen bg-background relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/10 blur-[150px] rounded-full translate-y-[-50%] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-full h-[500px] bg-accent/10 blur-[150px] rounded-full translate-y-[50%] translate-x-[20%] pointer-events-none" />
          
          {!isAuthenticated ? (
            <main className="container mx-auto px-4 relative z-10 flex min-h-screen items-center justify-center">
              {!showAuth ? (
                <Landing onAuthClick={handleAuthClick} />
              ) : (
                <div className="w-full flex flex-col items-center">
                   {/* Go Back button for Login screen */}
                   <button 
                     onClick={() => setShowAuth(false)}
                     className="mb-8 p-3 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"
                   >
                     ← Back to Home
                   </button>
                   <Login initialMode={authMode} />
                </div>
              )}
            </main>
          ) : (
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8 relative z-10 pb-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/mentors" element={<MentorList />} />
                  <Route path="/sessions" element={<SessionScheduler />} />
                  <Route path="/progress" element={<ProgressTracker />} />
                </Routes>
              </main>
            </>
          )}
        </div>
      </Router>
    </RoleContext.Provider>
  );
}

export default App;
