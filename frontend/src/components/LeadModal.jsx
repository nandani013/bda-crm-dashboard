import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const LeadModal = ({ isOpen, onClose, currentLead, refreshLeads }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    status: 'New',
    priority: 'Medium',
    notes: '',
  });

  useEffect(() => {
    if (currentLead) {
      setFormData({
        clientName: currentLead.clientName || '',
        companyName: currentLead.companyName || '',
        email: currentLead.email || '',
        phone: currentLead.phone || '',
        status: currentLead.status || 'New',
        priority: currentLead.priority || 'Medium',
        notes: currentLead.notes || '',
      });
    } else {
      // Reset form
      setFormData({
        clientName: '',
        companyName: '',
        email: '',
        phone: '',
        status: 'New',
        priority: 'Medium',
        notes: '',
      });
    }
  }, [currentLead, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentLead) {
        // Edit
        await api.put(`/leads/${currentLead._id}`, formData);
      } else {
        // Create
        await api.post('/leads', formData);
      }
      refreshLeads();
      onClose();
    } catch (error) {
      console.error('Error saving lead', error);
      alert('Error saving lead');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {currentLead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Client Name *</label>
              <input type="text" name="clientName" required value={formData.clientName} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Company Name *</label>
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>

          <div className="flex justify-end pt-4 mt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700">
              {currentLead ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
