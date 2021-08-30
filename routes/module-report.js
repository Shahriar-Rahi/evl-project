const express = require('express');
const moduleReportController = require('../controllers/moduleReport')
const router = express.Router();


router.post('/add-module-report', moduleReportController.addModuleReport);

module.exports = router;