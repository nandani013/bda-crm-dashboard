import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const TeamModal = ({ isOpen, onClose, currentMember, refreshTeam }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Associate',
    password: '',
  });

  useEffect(() => {
    if (currentMember) {
      setFormData({
        name: currentMember.name || '',
        email: currentMember.email || '',
        role: currentMember.role || 'Associate',
        password: '', // Empty for security, let them type a new one if they want to change
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Associate',
        password: '',
      });
    }
  }, [currentMember, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentMember) {
        // Edit
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        await api.put(`/team/${currentMember._id}`, dataToUpdate);
      } else {
        // Create
        if (!formData.password) {
          alert('Password is required for new employees');
          return;
        }
        await api.post('/team', formData);
      }
      refreshTeam();
      onClose();
    } catch (error) {
      console.error('Error saving team member', error);
      alert(error.response?.data?.message || 'Error saving team member');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {currentMember ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address *</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500">
              <option value="Associate">Associate</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              {currentMember ? 'New Password (leave blank to keep current)' : 'Initial Password *'}
            </label>
            <input type="password" name="password" required={!currentMember} value={formData.password} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg bg-slate-50 border-slate-200 focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <div className="flex justify-end pt-4 mt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700">
              {currentMember ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
