import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import { LogOut, LayoutDashboard, Briefcase, CheckSquare, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

import DashboardOverview from './DashboardOverview';
import ProjectsHub from './ProjectsHub';
import ProjectDetails from './ProjectDetails';
import SettingsPage from './SettingsPage';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/dashboard/projects', icon: <Briefcase size={18} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-surface overflow-hidden" id="dashboard-layout">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-[260px] bg-white border-r border-surface-border flex flex-col z-20 fixed h-full"
      >
        <div className="p-5 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
              TM
            </div>
            <span className="text-lg font-bold text-primary">Task Manager</span>
          </div>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              id={`nav-${item.name.toLowerCase().replace(/\s/g, '-')}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-primary truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role || 'Member'}</p>
            </div>
          </div>
          <button
            id="logout-button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-md transition-colors font-medium"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto ml-[260px]">
        {/* Top Header */}
        <header className="h-14 border-b border-surface-border bg-white/90 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-slate-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
              {user?.role === 'ADMIN' ? '🛡️ Admin' : '👤 Member'}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 relative z-0">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/projects" element={<ProjectsHub />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
