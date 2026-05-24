const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please add a client name'],
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  email: {
    type: String,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
