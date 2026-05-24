const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['CREATED_LEAD', 'UPDATED_LEAD', 'DELETED_LEAD', 'DEAL_CLOSED', 'EMPLOYEE_ASSIGNED', 'MEETING_SCHEDULED'], required: true },
  targetModel: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
