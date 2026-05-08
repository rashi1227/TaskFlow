import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart3, Users, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Role-Based Access',
    description: 'Fine-grained permissions with Admin and Member roles for secure collaboration.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics Dashboard',
    description: 'Real-time insights into task progress, team velocity, and overdue items.',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Kanban Boards',
    description: 'Drag-and-drop task management with status tracking across your projects.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Management',
    description: 'Add members, assign tasks, and track contributions across your team.',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden">
      {/* Navbar */}
      <nav className="w-full px-8 py-4 flex justify-between items-center border-b border-surface-border bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
            TM
          </div>
          <span className="text-lg font-bold text-primary">Task Manager</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link to="/register" className="btn-primary flex items-center gap-1.5">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pt-24 pb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-accent/5 to-primary-100/30 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Production-Ready Task Management
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] mb-6">
            Manage your team's
            <br />
            work with{' '}
            <span className="text-gradient">precision</span>
          </h1>

          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            A modern task management platform built for cross-functional teams.
            Plan, track, and ship with clarity and confidence.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-primary !px-8 !py-3 !text-base flex items-center gap-2">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary !px-8 !py-3 !text-base">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl relative z-10"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="card group hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-6 px-8 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Team Task Manager. Built with Spring Boot & React.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
