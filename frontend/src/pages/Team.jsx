import React, { useState, useEffect } from 'react';
import { Plus, Users as UsersIcon, Edit2, Trash2, Mail, Briefcase, BarChart, Activity, Filter, KanbanSquare } from 'lucide-react';
import api from '../utils/api';
import TeamModal from '../components/TeamModal';
import { Link } from 'react-router-dom';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get('/team');
      setTeam(res.data.data);
    } catch (error) {
      console.error('Failed to fetch team', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This will unassign all their active leads.')) {
      try {
        await api.delete(`/team/${id}`);
        fetchTeam();
      } catch (error) {
        console.error('Error deleting employee', error);
      }
    }
  };

  const openAddModal = () => {
    setCurrentMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-dark-900 text-slate-300 md:flex md:flex-col shrink-0">
        <div className="flex items-center justify-center h-16 border-b border-dark-800">
          <span className="text-xl font-bold text-white">ManufactureFlow</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-dark-800 hover:text-white">
            <Activity className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/leads" className="flex items-center px-4 py-3 rounded-lg hover:bg-dark-800 hover:text-white">
            <Filter className="w-5 h-5 mr-3" />
            Leads
          </Link>
          <Link to="/pipeline" className="flex items-center px-4 py-3 rounded-lg hover:bg-dark-800 hover:text-white">
            <KanbanSquare className="w-5 h-5 mr-3" />
            Pipeline
          </Link>
          <Link to="/team" className="flex items-center px-4 py-3 text-white rounded-lg bg-dark-800">
            <UsersIcon className="w-5 h-5 mr-3" />
            Team
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container px-6 py-8 mx-auto">
          <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
            <button 
              onClick={openAddModal}
              className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white rounded-lg md:mt-0 bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading team members...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {team.map((member) => (
                <div key={member._id} className="relative p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button onClick={() => openEditModal(member)} className="p-1.5 text-slate-400 hover:text-primary-600 bg-slate-50 rounded-md">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center justify-center w-20 h-20 mb-4 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-inner">
                      {getInitials(member.name)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                    <span className={`px-3 py-1 mt-2 text-xs font-semibold uppercase tracking-wider border rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600">
                      <Mail className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
                      <span>{member.totalLeads} Assigned Leads</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <BarChart className="w-4 h-4 mr-3 text-slate-400" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span>Performance</span>
                          <span className="font-medium text-slate-900">{member.performancePercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${member.performancePercentage >= 50 ? 'bg-green-500' : member.performancePercentage >= 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${member.performancePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <TeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentMember={currentMember} 
        refreshTeam={fetchTeam} 
      />
    </div>
  );
};

export default Team;
