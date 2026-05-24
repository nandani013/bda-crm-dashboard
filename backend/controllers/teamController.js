const User = require('../models/User');
const Lead = require('../models/Lead');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// @desc    Get all team members with their performance stats
// @route   GET /api/team
// @access  Private
exports.getTeamMembers = async (req, res) => {
  try {
    // We use aggregation to join Users with their assigned Leads
    const teamStats = await User.aggregate([
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'assignedEmployee',
          as: 'leads'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          totalLeads: { $size: '$leads' },
          closedLeads: {
            $size: {
              $filter: {
                input: '$leads',
                as: 'lead',
                cond: { $eq: ['$$lead.status', 'Closed'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          performancePercentage: {
            $cond: [
              { $eq: ['$totalLeads', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$closedLeads', '$totalLeads'] }, 100] }, 0] }
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: teamStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a new team member
// @route   POST /api/team
// @access  Private (Should ideally be restricted to Admin)
exports.addTeamMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Associate',
    });

    // Return without password
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private (Should ideally be restricted to Admin)
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updateFields = { name, email, role };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    user = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private (Should ideally be restricted to Admin)
exports.deleteTeamMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Optionally reassign leads here, or just delete the user
    // For now we just delete the user, and leads keep the dangling ObjectId,
    // or we could nullify them. Let's nullify them.
    await Lead.updateMany({ assignedEmployee: user._id }, { $unset: { assignedEmployee: "" } });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
