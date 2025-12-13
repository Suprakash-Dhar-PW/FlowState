import React, { useEffect, useState } from 'react';
import { Mail, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Inbox, TrendingUp, Users, Clock, Target } from 'lucide-react';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (err) {
      console.error('Failed to check auth status', err);
    }
  };

  const handleLogin = () => {
    window.location.href = '/auth/google';
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emails');
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error('Failed to fetch emails', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative text-center space-y-6 p-12 bg-slate-900 rounded-2xl border border-slate-800 ring-1 ring-white/10 max-w-md w-full backdrop-blur-xl">
              <div className="h-16 w-16 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                <Sparkles className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 leading-relaxed">Connect your Google account to streamline your freelance workflow with AI.</p>
              </div>
              <button
                onClick={handleLogin}
                className="w-full h-12 flex items-center justify-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95"
              >
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4 mr-2 opacity-90 invert" />
                <span>Sign in with Google</span>
              </button>
            </div>
        </div>

        {/* Value Proposition Grid */}
        <div className="mt-20 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Context-Aware</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Unlike basic calendars, we understand *what* the meeting is about by analyzing your client emails first.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Conflict Resolution</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Don't just see "Busy". We actively suggest the best alternative slots, saving you the back-and-forth.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Inbox className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Unified Workflow</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Read insights, decide, and book. All in one distraction-free interface designed for speed.</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-slate-400 font-medium text-sm">Active Clients</h3>
                 <Users className="w-5 h-5 text-indigo-400" />
             </div>
             <p className="text-2xl font-bold text-white">12</p>
             <p className="text-xs text-emerald-400 mt-1 flex items-center">
                 <TrendingUp className="w-3 h-3 mr-1" />
                 +2 this month
             </p>
         </div>
         <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-slate-400 font-medium text-sm">Hours Saved</h3>
                 <Clock className="w-5 h-5 text-purple-400" />
             </div>
             <p className="text-2xl font-bold text-white">8.5</p>
             <p className="text-xs text-slate-500 mt-1">vs last week</p>
         </div>
         <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-slate-400 font-medium text-sm">Pending Actions</h3>
                 <Target className="w-5 h-5 text-rose-400" />
             </div>
             <p className="text-2xl font-bold text-white">3</p>
             <p className="text-xs text-rose-400 mt-1">High Priority</p>
         </div>
         <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 border border-indigo-500 shadow-lg text-white">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-indigo-100 font-medium text-sm">Visual Focus</h3>
                 <Sparkles className="w-5 h-5 text-white" />
             </div>
             <p className="text-sm font-medium leading-tight">"Design is not just what it looks like and feels like. Design is how it works."</p>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
             Inbox Insights
             <span className="ml-3 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Beta</span>
           </h2>
           <p className="text-slate-400 mt-2 text-lg">AI-powered summaries of your latest client communications.</p>
        </div>
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="group relative inline-flex items-center px-6 py-3 border border-slate-700 rounded-xl shadow-sm text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 hover:text-white focus:outline-none ring-1 ring-white/5 disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] overflow-hidden"
        >
          {loading ? (
             <RefreshCw className="w-4 h-4 mr-2 animate-spin text-indigo-400" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          )}
          {loading ? 'Analyzing...' : (
             <div className="flex items-center">
                 <RefreshCw className="w-4 h-4 mr-2 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                 Refresh
             </div>
          )}
        </button>
      </div>

      <div className="grid gap-6">
        {emails.length === 0 && !loading && (
           <div className="text-center py-24 rounded-3xl border border-dashed border-slate-800 bg-slate-900/50">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-4 ring-1 ring-slate-700/50">
                    <Inbox className="w-8 h-8 text-slate-600" />
               </div>
               <h3 className="text-lg font-medium text-white mb-1">No emails analyzed</h3>
               <p className="text-slate-500 max-w-sm mx-auto">Click "Refresh" above to fetch and summarize your latest unread client emails.</p>
           </div>
        )}
        
        {emails.map((email, idx) => (
          <div 
            key={email.id} 
            className="group relative bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] ring-1 ring-white/5"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="p-1 absolute top-0 right-0">
                <div className="absolute top-6 right-6 flex items-center space-x-2">
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Summary
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                   <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                       {email.from.charAt(0).toUpperCase()}
                   </div>
                   <div>
                       <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors cursor-pointer">{email.subject}</h3>
                       <p className="text-sm font-medium text-slate-400 flex items-center">
                           <Mail className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                           {email.from}
                       </p>
                   </div>
                </div>
              </div>
              
              <div className="relative bg-slate-950/50 rounded-xl p-5 border border-slate-800/50 group-hover:border-indigo-500/10 transition-colors">
                <div className="absolute -left-1 top-6 bottom-6 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-75"></div>
                <p className="text-slate-300 font-medium leading-relaxed pl-3 italic">
                  "{email.summary}"
                </p>
              </div>
              
              <div className="mt-4 pl-1">
                  <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">Original snippet: {email.snippet}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
