const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all leads (with pagination, search, filter)
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    // Search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { clientName: searchRegex },
        { companyName: searchRegex }
      ];
    }

    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Execute query with pagination
    const leads = await Lead.find(query)
      .populate('assignedEmployee', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count for pagination metadata
    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: leads
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    // Optionally automatically assign the lead to the creator if not provided
    if (!req.body.assignedEmployee) {
      req.body.assignedEmployee = req.user.id;
    }

    const lead = await Lead.create(req.body);

    await Activity.create({
      user: req.user.id,
      action: 'CREATED_LEAD',
      targetModel: 'Lead',
      targetId: lead._id,
      details: `Created lead for ${lead.clientName}`
    });

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await Activity.create({
      user: req.user.id,
      action: 'UPDATED_LEAD',
      targetModel: 'Lead',
      targetId: lead._id,
      details: `Updated lead ${lead.clientName}${req.body.status && oldStatus !== req.body.status ? ` (Status changed from ${oldStatus} to ${req.body.status})` : ''}`
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const clientName = lead.clientName;
    await lead.deleteOne();

    await Activity.create({
      user: req.user.id,
      action: 'DELETED_LEAD',
      targetModel: 'Lead',
      targetId: req.params.id,
      details: `Deleted lead for ${clientName}`
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
