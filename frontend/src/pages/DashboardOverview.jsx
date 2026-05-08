import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, Loader2 } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, icon, colorClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="card flex items-center justify-between"
  >
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-primary">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
      {icon}
    </div>
  </motion.div>
);

const COLORS = ['#64748B', '#6366F1', '#10B981'];

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Fallback to empty data
      setAnalytics({
        totalTasks: 0,
        todoCount: 0,
        inProgressCount: 0,
        doneCount: 0,
        overdueCount: 0,
        tasksByUser: {},
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const statusData = [
    { name: 'To Do', value: analytics.todoCount, color: '#64748B' },
    { name: 'In Progress', value: analytics.inProgressCount, color: '#6366F1' },
    { name: 'Done', value: analytics.doneCount, color: '#10B981' },
  ];

  const userDistribution = Object.entries(analytics.tasksByUser || {}).map(([name, count]) => ({
    name,
    tasks: count,
  }));

  return (
    <div className="space-y-6 pb-10" id="dashboard-overview">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon={<ListTodo className="w-6 h-6 text-primary" />}
          colorClass="bg-primary/5"
          delay={0}
        />
        <StatCard
          title="In Progress"
          value={analytics.inProgressCount}
          icon={<Clock className="w-6 h-6 text-accent" />}
          colorClass="bg-accent/10"
          delay={0.05}
        />
        <StatCard
          title="Completed"
          value={analytics.doneCount}
          icon={<CheckCircle2 className="w-6 h-6 text-success" />}
          colorClass="bg-success-light"
          delay={0.1}
        />
        <StatCard
          title="Overdue"
          value={analytics.overdueCount}
          icon={<AlertTriangle className="w-6 h-6 text-danger" />}
          colorClass="bg-danger-light"
          delay={0.15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">Task Status</h3>
          {analytics.totalTasks > 0 ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
              No task data yet
            </div>
          )}
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">Tasks per Team Member</h3>
          {userDistribution.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userDistribution} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="tasks" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
              Assign tasks to team members to see distribution
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
