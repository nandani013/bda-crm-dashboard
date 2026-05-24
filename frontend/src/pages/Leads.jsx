import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, Activity, KanbanSquare, Users } from 'lucide-react';
import api from '../utils/api';
import LeadModal from '../components/LeadModal';
import { Link } from 'react-router-dom';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leads?page=${page}&limit=10&search=${search}&status=${statusFilter}`);
      setLeads(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Failed to fetch leads', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [page, search, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead', error);
      }
    }
  };

  const openAddModal = () => {
    setCurrentLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setCurrentLead(lead);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Proposal Sent': return 'bg-purple-100 text-purple-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Reused layout for consistency */}
      <aside className="hidden w-64 bg-dark-900 text-slate-300 md:flex md:flex-col">
        <div className="flex items-center justify-center h-16 border-b border-dark-800">
          <span className="text-xl font-bold text-white">ManufactureFlow</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-dark-800 hover:text-white">
            <Activity className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/leads" className="flex items-center px-4 py-3 text-white rounded-lg bg-dark-800">
            <Filter className="w-5 h-5 mr-3" />
            Leads
          </Link>
          <Link to="/pipeline" className="flex items-center px-4 py-3 rounded-lg hover:bg-dark-800 hover:text-white">
            <KanbanSquare className="w-5 h-5 mr-3" />
            Pipeline
          </Link>
          <Link to="/team" className="flex items-center px-4 py-3 rounded-lg hover:bg-dark-800 hover:text-white">
            <Users className="w-5 h-5 mr-3" />
            Team
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container px-6 py-8 mx-auto">
          <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
            <button 
              onClick={openAddModal}
              className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white rounded-lg md:mt-0 bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </button>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-2xl">
            {/* Filters */}
            <div className="flex flex-col items-center justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
              <div className="relative w-full md:w-96">
                <Search className="absolute w-5 h-5 text-slate-400 left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="w-full py-2 pl-10 pr-4 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="flex items-center w-full md:w-auto">
                <Filter className="w-5 h-5 mr-2 text-slate-400" />
                <select
                  className="w-full py-2 pl-3 pr-8 border rounded-lg md:w-48 bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 pr-4 font-semibold text-slate-600">Client / Company</th>
                    <th className="p-4 font-semibold text-slate-600">Contact Info</th>
                    <th className="p-4 font-semibold text-slate-600">Status</th>
                    <th className="p-4 font-semibold text-slate-600">Priority</th>
                    <th className="p-4 font-semibold text-right text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">Loading leads...</td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">No leads found.</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 pr-4">
                          <div className="font-medium text-slate-900">{lead.clientName}</div>
                          <div className="text-sm text-slate-500">{lead.companyName}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-slate-900">{lead.email || 'N/A'}</div>
                          <div className="text-sm text-slate-500">{lead.phone || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-700">{lead.priority}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => openEditModal(lead)} className="p-2 text-slate-400 hover:text-primary-600">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(lead._id)} className="p-2 ml-2 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border rounded-lg bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border rounded-lg bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentLead={currentLead} 
        refreshLeads={fetchLeads} 
      />
    </div>
  );
};

export default Leads;
