const express = require('express');
const moduleReportController = require('../controllers/moduleReport')
const router = express.Router();

router.get('/get-module-report', moduleReportController.getModuleReport);
router.post('/add-module-report', moduleReportController.addModuleReport);
router.put('/update-module-report/:modRepId', moduleReportController.updateModuleReport);
router.delete('/delete-module-report/:modRepId', moduleReportController.deleteModuleReport);


module.exports = router;