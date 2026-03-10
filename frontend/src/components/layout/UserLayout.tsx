import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white border-b border-slate-100 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-xl tracking-tight">Crown Cuts</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-slate-800 hover:text-primary font-medium transition-colors">Home</a>
            <a href="#services" className="text-slate-800 hover:text-primary font-medium transition-colors">Services</a>
            <a href="#queue" className="text-slate-800 hover:text-primary font-medium transition-colors">Live Queue</a>
            <Link to="/book" className="bg-primary text-white px-5 py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all shadow-sm">
              Book Now
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-slate-900">
              <Icon icon="lucide:menu" width="28" />
            </button>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 Crown Cuts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;