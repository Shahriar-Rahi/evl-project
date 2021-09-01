const User = require('../models/user');

exports.addUser = (req, res, next) => {
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
    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            preRes.success = false;
            preRes.message = "User Already Exists";
            return res.status(409).json(preRes);
        }
    }).catch(err => {
        preRes.success = false;
        preRes.message = "Couldn't check existence" + err;
        return res.status(500).json(preRes);
        //next(preRes);
    });
    User.findOne({ userCode: userCode }).then(userDoc => {
        if (userDoc) {
            preRes.success = false;
            preRes.message = "User Already Exists";
            return res.status(409).json(preRes);
        }
    }).catch(err => {
        preRes.success = false;
        preRes.message = "Couldn't check existence" + err;
        return res.status(500).json(preRes);
        //next(preRes);
    });
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
        preRes.succes = true;
        preRes.message = "Users fetched successfully";
        preRes.data = users;
        res.status(201).json(preRes);
    }).catch(err => {
        preRes.message = "Couldn't fetch user"
        res.status(500).json(preRes);
    })
}

exports.updateUser = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    let userId;
    if (!req.params.userId) {
        const errMsg = "No params provided";
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
        return res.status(err.status).json(preRes);

    });
}

exports.deleteUser = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: {}
    }
    let userId;
    if (!req.params.userId) {
        const errMsg = "No params provided";
        preRes.message = errMsg;
        console.error(`${errMsg}`)
        return res.status(409).json(preRes);
    }
    else {
        userId = req.params.userId;
    }

    User.findById(userId).then(user => {
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        return User.findByIdAndRemove(userId);
    }).then(() => {
        preRes.success = true;
        preRes.message = `user deleted successfully`;
        return res.status(200).json(preRes);
    }).catch(err => {
        preRes.message = err.message;
        return res.status(err.status).json(preRes);

    });
}