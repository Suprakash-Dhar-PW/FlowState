import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Zap, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CalendarBooking from './pages/CalendarBooking';

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');
  
  return (
    <Link 
      to={to} 
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-500/50' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
      {children}
    </Link>
  );
}

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
     fetch('/api/auth/status')
       .then(res => res.json())
       .then(data => {
           if (data.isAuthenticated) {
               setUser(data.user);
           }
       });
  }, []);

  const handleLogout = () => {
      window.location.href = '/auth/logout';
  };

  return (
    <Router>
      <div className="h-screen bg-transparent flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <Zap className="h-6 w-6 text-indigo-500 mr-2" />
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              FlowState
            </span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink to="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavLink>
            <NavLink to="/calendar" icon={Calendar}>
              Calendar & Booking
            </NavLink>
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 group hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center overflow-hidden">
                {user?.picture ? (
                    <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full border border-slate-600 mr-3" />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3 text-xs">
                        {user?.name?.charAt(0) || 'F'}
                    </div>
                )}
                <div>
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="text-sm font-medium text-slate-200 truncate max-w-[100px]">{user?.name || 'Freelancer'}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors p-1" title="Sign Out">
                 <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Wrapper for passing location to NavLink */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
             <Content />
        </div>
      </div>
    </Router>
  );
}

function Content() {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<CalendarBooking />} />
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </div>
          </main>
    )
}

export default App;