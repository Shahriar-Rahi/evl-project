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

exports.getModuleReport = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    ModuleReport.find().then(modReps => {
        preRes.succes = true;
        preRes.message = "Module Reports fetched successfully";
        preRes.data = modReps;
        res.status(201).json(preRes);
    }).catch(err => {
        preRes.message = "Couldn't fetch Module Reports"
        res.status(500).json(preRes);
    })
}

exports.updateModuleReport = (req, res, next) => {
    //modRep === moduleReport
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    let modRepId;
    if (!req.params.modRepId) {
        const errMsg = "No params provided";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    else {
        modRepId = req.params.modRepId;
    }

    const missingKeys = !req.body.completedModuleName || !req.body.correctMark || !req.body.totalMark

    if (missingKeys) {
        const errMsg = "Keys missing in request body";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    const { completedModuleName, correctMark, totalMark } = req.body;
    // moduleReportData = {
    //     completedModuleName,
    //     correctMark,
    //     totalMark
    // }
    User.findById(modRepId).then(modRep => {
        if (!modRep) {
            const error = new Error('Could not find module report.');
            error.statusCode = 404;
            throw error;
        }
        modRep.completedModuleName = completedModuleName;
        modRep.correctMark = correctMark;
        modRep.totalMark = totalMark;
        return modRep.save();
    }).then(resp => {
        preRes.success = true;
        preRes.message = `module report updated successfully`
        preRes.data = resp;
        return res.status(200).json(preRes);
    }).catch(err => {
        preRes.message = err.message;
        return res.status(err.status).json(preRes);

    });
}

exports.deleteModuleReport = (req, res, next) => {
    //modRep === moduleReport
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    let modRepId;
    if (!req.params.modRepId) {
        const errMsg = "No params provided";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    else {
        modRepId = req.params.modRepId;
    }

    User.findById(modRepId).then(modRep => {
        if (!modRep) {
            const error = new Error('Could not find module report.');
            error.statusCode = 404;
            throw error;
        }
        return User.findByIdAndRemove(modRepId);
    }).then(() => {
        preRes.success = true;
        preRes.message = `module report deleted successfully`;
        return res.status(200).json(preRes);
    }).catch(err => {
        preRes.message = err.message;
        return res.status(err.status).json(preRes);

    });
}