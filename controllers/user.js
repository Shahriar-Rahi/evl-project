const User = require('../models/user');
const ModuleReport = require('../models/moduleReport');
const mongoose = require('mongoose');

exports.addUser = async (req, res, next) => {
    let preRes = {
        success: false,
        message: "user creation successful",
        data: {}
    }
    const missingKeys = !req.body.name || !req.body.email || !req.body.phone || !req.body.userCode;

    if (missingKeys) {
        const errMsg = "Keys missing in request body";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    const { name, email, phone, userCode } = req.body;
    userData = {
        name: name,
        email: email,
        phone: phone,
        userCode: userCode
    }
    try {
        const userDocEmail = await User.findOne({ email: email });
        const userDocCode = await User.findOne({ userCode: userCode });
        if (userDocEmail || userDocCode) {
            preRes.success = false;
            preRes.message = "User Already Exists";
            return res.status(409).json(preRes);
        }
    } catch (err) {

        preRes.success = false;
        preRes.message = "Couldn't check existence" + err;
        return res.status(500).json(preRes);

    }


    const user = new User(userData);
    user.save()
        .then(result => {
            preRes.success = true;
            preRes.message = "User Created Successfully"
            preRes.data = { ...result._doc };
            return res.status(201).json(preRes);
        })
        .catch(err => {
            preRes.success = false;
            preRes.message = "Couldn't save the data" + err;
            return res.status(500).json(preRes);
            //next(preRes);
        });
}

exports.getUser = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    User.find().then(users => {
        preRes.success = true;
        preRes.message = "Users fetched successfully";
        preRes.data = users;
        res.status(200).json(preRes);
    }).catch(err => {
        preRes.message = "Couldn't fetch user"
        res.status(500).json(preRes);
    });
}

exports.updateUser = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    let userId;
    if (!req.params.userId || !(mongoose.isValidObjectId(req.params.userId))) {
        const errMsg = "No params provided or bad params";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    else {
        userId = req.params.userId;
    }

    const missingKeys = !req.body.name || !req.body.email || !req.body.phone || !req.body.userCode;

    if (missingKeys) {
        const errMsg = "Keys missing in request body";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    const { name, email, phone, userCode } = req.body;
    // userData = {
    //     name: name,
    //     email: email,
    //     phone: phone,
    //     userCode: userCode
    // }
    User.findById(userId).then(user => {
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.userCode = userCode;
        return user.save();
    }).then(resp => {
        preRes.success = true;
        preRes.message = `user updated successfully`
        preRes.data = resp;
        return res.status(200).json(preRes);
    }).catch(err => {
        preRes.message = err.message;
        return res.status(err.statusCode).json(preRes);

    });
}

exports.deleteUser = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    let userId;
    if (!req.params.userId || !(mongoose.isValidObjectId(req.params.userId))) {
        const errMsg = "No params provided or bad params";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    else {
        userId = req.params.userId;
    }

    User.findById(userId).then(user => {
        if (!user) {
            const error = new Error('Could not find user with this user id.');
            error.statusCode = 404;
            throw error;
        }
        return User.findByIdAndRemove(userId);
    }).then(async () => {
        try {
            const userModuleReport = await ModuleReport.findOne({ userId: userId });
            if (userModuleReport) {
                const modRepId = userModuleReport.id;
                // ModuleReport.findByIdAndRemove(modRepId).then(() => {
                //     preRes.success = true;
                //     preRes.message = `User and it's module report data deleted successfully`;
                //     return res.status(200).json(preRes);
                // }).catch((err) => {

                //     preRes.message = 'Something went wrong while deleting users module report data' + err;
                //     return res.status(500).json(preRes);
                // });
                try {
                   await ModuleReport.findByIdAndRemove(modRepId);
                   preRes.success = true;
                   preRes.message = `User and it's module report data deleted successfully`;
                   return res.status(200).json(preRes);
                } catch (err) {
                    
                    preRes.message = 'Something went wrong while deleting users module report data' + err;
                    return res.status(500).json(preRes);
                }
            }
            preRes.success = true;
            preRes.message = `User deleted successfully`;
            return res.status(200).json(preRes);

        } catch (error) {
            preRes.message = 'Something went wrong while deleting users module report data';
            return res.status(500).json(preRes);
        }
    }).catch(err => {
        preRes.message = err.message;
        return res.status(err.statusCode).json(preRes);

    });
}