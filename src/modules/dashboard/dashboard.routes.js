const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('./dashboard.controller');

// GET /api/dashboard/metrics - Get dashboard metrics
router.get('/metrics', getDashboardMetrics);

module.exports = router;