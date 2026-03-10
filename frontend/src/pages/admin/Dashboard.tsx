import React from 'react';
import { Icon } from '@iconify/react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop Overview</h1>
          <p className="text-slate-500">Welcome back, Admin.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Icon icon="lucide:calendar" />
            Today
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: '$1,284.00', icon: 'lucide:banknote', color: 'text-green-600' },
          { label: 'Appointments', value: '24', icon: 'lucide:calendar-check', color: 'text-blue-600' },
          { label: 'Walk-ins', value: '12', icon: 'lucide:users', color: 'text-purple-600' },
          { label: 'Avg. Wait', value: '15 min', icon: 'lucide:clock', color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <Icon icon={stat.icon} width="24" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Recent Activity</h2>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="p-6">
            {/* Activity List Placeholder */}
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon icon="lucide:user" className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">New booking: John Doe</p>
                    <p className="text-xs text-slate-500">Fade & Beard Trim • 2:00 PM</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;