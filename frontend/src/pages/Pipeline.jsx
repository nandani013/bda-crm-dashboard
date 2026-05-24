import React, { useState, useEffect } from 'react';
import { Activity, Filter, KanbanSquare, Users } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const COLUMNS = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed'];

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Proposal Sent': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Closed': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Pipeline = () => {
  const [columns, setColumns] = useState({
    'New': [],
    'Contacted': [],
    'Proposal Sent': [],
    'Negotiation': [],
    'Closed': [],
  });
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Fetching max leads for the pipeline to show them all, normally we might paginate but Kanban boards need full datasets per column
      const res = await api.get('/leads?limit=1000');
      const leads = res.data.data;
      
      const newCols = {
        'New': [],
        'Contacted': [],
        'Proposal Sent': [],
        'Negotiation': [],
        'Closed': [],
      };
      
      leads.forEach(lead => {
        if (newCols[lead.status]) {
          newCols[lead.status].push(lead);
        } else {
          // Fallback if status is weird
          newCols['New'].push(lead);
        }
      });
      
      setColumns(newCols);
    } catch (error) {
      console.error('Error fetching leads for pipeline', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    
    // If dropped in the same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    
    const sourceCol = Array.from(columns[sourceColId]);
    const destCol = Array.from(columns[destColId]);
    
    // Remove from source
    const [movedLead] = sourceCol.splice(source.index, 1);
    
    if (sourceColId === destColId) {
      // Reordering within the same column
      sourceCol.splice(destination.index, 0, movedLead);
      setColumns({
        ...columns,
        [sourceColId]: sourceCol
      });
      // Optionally save order here if we tracked position indices in the DB
    } else {
      // Moving to a new column
      movedLead.status = destColId; // update local status eagerly
      destCol.splice(destination.index, 0, movedLead);
      
      setColumns({
        ...columns,
        [sourceColId]: sourceCol,
        [destColId]: destCol,
      });

      // API Call to update status
      try {
        await api.put(`/leads/${draggableId}`, { status: destColId });
      } catch (error) {
        console.error('Failed to update lead status', error);
        // Revert on failure
        fetchLeads();
      }
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
          <Link to="/pipeline" className="flex items-center px-4 py-3 text-white rounded-lg bg-dark-800">
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Sales Pipeline</h1>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">Loading Pipeline...</div>
          ) : (
            <div className="flex flex-1 gap-6 overflow-x-auto pb-4 h-[calc(100vh-160px)]">
              <DragDropContext onDragEnd={onDragEnd}>
                {COLUMNS.map(colId => (
                  <div key={colId} className="flex flex-col w-80 shrink-0 bg-slate-100 rounded-xl p-4 shadow-inner border border-slate-200/60">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-semibold text-slate-700">{colId}</h3>
                      <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                        {columns[colId]?.length || 0}
                      </span>
                    </div>
                    
                    <Droppable droppableId={colId}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 min-h-[150px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                        >
                          {columns[colId]?.map((lead, index) => (
                            <Draggable key={lead._id} draggableId={lead._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-3 p-4 bg-white rounded-lg shadow-sm border ${getStatusColor(lead.status).split(' ')[2]} ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500 ring-opacity-50' : 'hover:shadow-md'} transition-shadow`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    // Make sure dragging card stays on top
                                    zIndex: snapshot.isDragging ? 50 : 'auto',
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-slate-900 truncate pr-2">{lead.clientName}</h4>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${lead.priority === 'High' ? 'bg-red-100 text-red-700' : lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                                      {lead.priority}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mb-3 truncate">{lead.companyName}</p>
                                  {lead.email && <p className="text-xs text-slate-400 truncate">{lead.email}</p>}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </DragDropContext>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Pipeline;
