import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, CheckCircle, DollarSign, Calendar, Activity, BarChart2, LogOut, Filter, KanbanSquare } from 'lucide-react';

/**
 * Sidebar navigation component with dark theme and smooth hover animations.
 * Props:
 *   logout: function to call when the logout button is clicked.
 */
const Sidebar = ({ logout }) => {
  const linkClasses = "flex items-center px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800 hover:text-white";
  const activeClasses = "bg-gray-800 text-white";

  return (
    <aside className="hidden w-64 bg-gray-900 text-gray-300 md:flex md:flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-xl font-bold text-white">ManufactureFlow</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`} end>
          <Activity className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/leads" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
          <Filter className="w-5 h-5 mr-3" />
          Leads
        </NavLink>
        <NavLink to="/pipeline" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
          <KanbanSquare className="w-5 h-5 mr-3" />
          Pipeline
        </NavLink>
        <NavLink to="/team" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
          <Users className="w-5 h-5 mr-3" />
          Team
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
