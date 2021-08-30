const ModuleReport = require('../models/moduleReport');

exports.addModuleReport = (req, res, next) => {
    let preRes = {
        success: false,
        message: "Module Report creation successful",
        data: {}
    }
    const missingKeys = !req.body.completedModuleName || !req.body.correctMark || !req.body.totalMark || !req.body.userId;

    if (missingKeys) {
        const errMsg = "Keys missing in request body";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    const { completedModuleName, correctMark, totalMark, userId } = req.body;
    moduleReportData = {
        //completedModuleName: [...completedModuleName],
        completedModuleName,
        correctMark,
        totalMark,
        userId
    }
    const moduleReport = new ModuleReport(moduleReportData);
    moduleReport.save()
        .then(result => {
            preRes.success = true;
            preRes.message = "Module Report Created Successfully"
            preRes.data = { ...result._doc };
            return res.status(201).json(preRes);
        })
        .catch(err => {
            preRes.success = false;
            preRes.message = "Couldn't save the data";
            return res.status(201).json(preRes);
            //next(preRes);
        });
}