import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from '@iconify/react';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <span className="text-xl font-bold text-primary">Crown Cuts</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <div className="pb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Main</p>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon icon="lucide:layout-dashboard" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin/queue" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium mt-1 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon icon="lucide:list-ordered" />
              Live Queue
            </NavLink>
          </div>

          <div className="pb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Management</p>
            <NavLink 
              to="/admin/clients" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon icon="lucide:users" />
              Clients
            </NavLink>
            <NavLink 
              to="/admin/commission" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium mt-1 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon icon="lucide:banknote" />
              Commission
            </NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 transition-colors w-full">
            <Icon icon="lucide:log-out" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;