const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

// All lead routes are protected
router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
