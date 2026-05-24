import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Briefcase, CheckCircle, DollarSign, Calendar, Activity, BarChart2, LogOut, Filter, KanbanSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

import api from '../utils/api';
import Card from '../components/ui/Card';
import Layout from '../components/ui/Layout';
import Sidebar from '../components/ui/Sidebar';

const pipelineData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const performanceData = [
  { name: 'Week 1', leads: 40, deals: 24 },
  { name: 'Week 2', leads: 30, deals: 13 },
  { name: 'Week 3', leads: 20, deals: 38 },
  { name: 'Week 4', leads: 27, deals: 39 },
];

const [activities, setActivities] = useState([]);

useEffect(() => {
  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data.data);
    } catch (err) {
      console.error('Failed to fetch activities', err);
    }
  };
  fetchActivities();
}, []);


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const stats = [
    { name: 'Total Leads', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Deals', value: '456', icon: Briefcase, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Closed Deals', value: '89', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Revenue', value: '$1.2M', icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-100' },
    { name: 'Meetings', value: '12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar (using reusable component) */}
      <Sidebar logout={logout} />

      {/* Main Content */}
      <Layout>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
          <div className="flex items-center md:hidden">
            <button onClick={logout} className="p-2 text-slate-500 hover:text-slate-700">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <Card key={index} className="flex items-center p-6">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* Revenue Pipeline */}
          <div className="p-6 bg-white shadow-sm lg:col-span-2 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Revenue Pipeline</h2>
              <BarChart2 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pipelineData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="p-6 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Performance</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="deals" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="p-6 bg-white shadow-sm rounded-2xl">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Recent Activities</h2>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 mr-4 bg-primary-500 rounded-full"></div>
                  <p className="text-sm font-medium text-slate-800">{activity.details}</p>
                </div>
                <span className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;
