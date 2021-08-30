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
            preRes.message = "Couldn't save the data";
            return res.status(201).json(preRes);
            //next(preRes);
        });
}