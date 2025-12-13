import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, ChevronRight, Loader2, CalendarCheck, AlertTriangle } from 'lucide-react';

const CalendarBooking = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [availability, setAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    setLoading(true);
    setAvailability(null);
    setBookingStatus(null);
    // Construct ISO strings
    const startIso = `${date}T${startTime}:00Z`;
    const endIso = `${date}T${endTime}:00Z`;

    try {
      const res = await fetch(`/api/calendar/check-slot?start=${startIso}&end=${endIso}`);
      const data = await res.json();
      setAvailability(data);
      if (!data.isFree) {
          fetchSuggestions();
      }
    } catch (err) {
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
      try {
          const res = await fetch(`/api/calendar/free-slots?date=${date}`);
          const data = await res.json();
          setSuggestions(data);
      } catch (err) {
          console.error("Failed to fetch suggestions", err);
      }
  };

  const handleBook = async () => {
    // Elegant confirmation could be a modal, using confirm for speed as requested but could be nicer
    if (!confirm('Area you sure you want to book this session?')) return;
    
    setLoading(true);
    const startIso = `${date}T${startTime}:00Z`;
    const endIso = `${date}T${endTime}:00Z`;
    
    try {
        const res = await fetch('/api/calendar/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                summary: 'Client Meeting (FreelanceAssist)',
                start: startIso,
                end: endIso
            })
        });
        
        if (res.ok) {
            setBookingStatus({ success: true, message: 'Session Confirmed' });
            setAvailability(null); // Reset
        } else {
            const err = await res.json();
            setBookingStatus({ success: false, message: `Failed: ${err.error}` });
        }
    } catch (err) {
        setBookingStatus({ success: false, message: 'Network connection issue.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
         <div>
             <h2 className="text-3xl font-bold text-white tracking-tight">Smart Scheduler</h2>
             <p className="text-slate-400 mt-2 text-lg">Check availability and secure your time slots instantly.</p>
         </div>
         <div className="hidden sm:block p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
             <CalendarCheck className="w-8 h-8 text-indigo-500" />
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Section */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 shadow-xl ring-1 ring-white/5 space-y-6">
                 <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 rounded-xl bg-slate-800 border-2 border-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-600 transition-colors sm:text-sm shadow-sm"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Time Slot (UTC)</label>
                   <div className="grid grid-cols-2 gap-3">
                       <div className="relative">
                            <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                                type="time" 
                                value={startTime} 
                                onChange={(e) => setStartTime(e.target.value)}
                                className="block w-full pl-9 pr-2 py-2.5 rounded-xl bg-slate-800 border-2 border-slate-700/50 text-white text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-600 transition-colors text-sm"
                            />
                       </div>
                       <div className="relative">
                           <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                                type="time" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)}
                                className="block w-full pl-9 pr-2 py-2.5 rounded-xl bg-slate-800 border-2 border-slate-700/50 text-white text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-600 transition-colors text-sm"
                            />
                       </div>
                   </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={checkAvailability}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Availability'}
                    </button>
                </div>
              </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
              {!availability && !bookingStatus && (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                      <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 ring-1 ring-slate-800">
                          <Clock className="w-8 h-8 text-slate-700" />
                      </div>
                      <p>Select a date and time to check availability</p>
                  </div>
              )}

              {availability && (
                <div className="animate-in zoom-in-95 duration-300">
                  <div className={`relative overflow-hidden rounded-3xl p-8 border ${availability.isFree ? 'bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30' : 'bg-gradient-to-br from-rose-900/20 to-slate-900 border-rose-500/30'} shadow-2xl`}>
                      
                      {/* Background decor */}
                      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 -mr-32 -mt-32 ${availability.isFree ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                      <div className="relative flex items-start gap-6">
                            <div className={`flex-shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${availability.isFree ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {availability.isFree ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${availability.isFree ? 'from-emerald-400 to-green-300' : 'from-rose-400 to-red-300'}`}>
                                    {availability.isFree ? 'Slot Available' : 'Wait, Slot Busy'}
                                </h3>
                                
                                <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50 backdrop-blur-sm">
                                    {availability.isFree ? (
                                        <div className="space-y-2">
                                            <p className="text-emerald-100/80">Great news! You are free between <span className="text-white font-medium">{startTime}</span> and <span className="text-white font-medium">{endTime}</span>.</p>
                                            <div className="pt-4">
                                                <button
                                                    onClick={handleBook}
                                                    className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                                >
                                                    Secure This Slot <ChevronRight className="ml-2 w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-rose-200/80 space-y-3">
                                            <p>There is a conflict in your schedule:</p>
                                            <ul className="space-y-2 pl-2">
                                                {availability.busySlots.map((slot, i) => (
                                                    <li key={i} className="flex items-center text-sm p-2 rounded bg-rose-950/30 border border-rose-500/10">
                                                        <AlertTriangle className="w-4 h-4 mr-2 text-rose-400" />
                                                        {new Date(slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(slot.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                      </div>

                      {/* Suggestions Panel */}
                      {!availability.isFree && suggestions && (
                        <div className="mt-6 pt-6 border-t border-rose-500/10 animate-in slide-in-from-bottom-2">
                            <h4 className="flex items-center text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                                Alternative Suggestion
                            </h4>
                            <div className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                                <p className="text-yellow-200/90 text-sm leading-relaxed">{suggestions.message}</p>
                            </div>
                        </div>
                      )}

                  </div>
                </div>
              )}
              
              {bookingStatus && (
                 <div className={`mt-6 p-4 rounded-xl flex items-center ${bookingStatus.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'} animate-in fade-in slide-in-from-bottom-2`}>
                     {bookingStatus.success ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                     <span className="font-medium">{bookingStatus.message}</span>
                 </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default CalendarBooking;
