const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/by-month', statisticsController.calculateRevenueByMonthRange);
router.get('/by-product', statisticsController.calculateStatisticsByProduct);
router.get('/by-hour', statisticsController.calculateRevenueByHour);
router.get('/by-day', statisticsController.calculateRevenueByDay);
router.get('/by-quarter', statisticsController.calculateRevenueByQuarter);
router.get('/by-year', statisticsController.calculateRevenueByYear);

module.exports = router;
