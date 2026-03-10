import React from 'react';
import UserLayout from '../components/layout/UserLayout';
import { useQueue } from '../hooks/useQueue';

const LandingPage: React.FC = () => {
  const { queue } = useQueue();

  return (
    <UserLayout>
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-sm font-bold mb-6 uppercase tracking-wider">
              The Gold Standard
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Precision Meets <span className="text-primary">Style</span>.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0">
              Experience the ultimate grooming service at Crown Cuts. Expert barbers, 
              modern techniques, and a classic atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg">
                Book Appointment
              </button>
              <button className="bg-white border-2 border-slate-200 text-slate-800 px-8 py-4 rounded-md font-bold text-lg hover:border-primary transition-all">
                View Queue
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
            <div className="w-full h-[400px] lg:h-[500px] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" 
                alt="Barber Shop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Queue Section */}
      <section id="queue" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Live Waitlist</h2>
            <p className="text-slate-600 mt-2">Check current wait times and join the queue from anywhere.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {queue.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{entry.clientName}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    {entry.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm">Est. Wait: {entry.estimatedWaitMinutes} mins</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </UserLayout>
  );
};

export default LandingPage;