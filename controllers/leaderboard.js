//const User = require('../models/user');
const ModuleReport = require('../models/moduleReport');
const jtc = require('../utils/csv-parser');

exports.showLeaderboard = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: []
    }

    let searchOptions = {};
    let searchUserCode = null, searchCompletedModuleName = null;
    if (req.body && Object.keys(req.body).length > 0) {
        if (req.body.userCode) {
            searchUserCode = req.body.userCode;
            //searchOptions.userCode = searchUserCode;
        }
        if (req.body.completedModuleName) {
            searchCompletedModuleName = req.body.completedModuleName;
            //searchOptions.completedModuleName = { $in: searchCompletedModuleName }
        }
    }
    let sortOrder = -1;

    if (req.query) {
        if (req.query.sortOrder === 'desc')
            sortOrder = 1;
    }

    ModuleReport.find(searchOptions)
        .select('completedModuleName correctMark totalMark -_id')
        .populate('userId', 'name email userCode -_id')
        .sort({ correctMark: -1 })
        .then(result => {
            preRes.success = true;
            preRes.message = "Leaderboard Created Successfully"
            //preRes.data = [...result];
            let leaderboardrank = 0;
            const leaderboardData = [];
            [...result].forEach(element => {
                const { userCode, name, email } = element.userId;
                const reshapedObj = {
                    userCode: userCode,
                    name: name,
                    email: email,
                    completedModuleName: element.completedModuleName,
                    leaderboard: ++leaderboardrank,
                    mark: `${element.correctMark}/${element.totalMark}`
                };
                leaderboardData.push(reshapedObj);
            });
            if (sortOrder === 1) {
                leaderboardData.reverse();
            }
            let searchedLeaderboardData = [];
            if (searchUserCode !== null) {
                const searchedElement = leaderboardData.filter(element => element.userCode === searchUserCode);
                if (searchedElement)
                    searchedLeaderboardData.push(...searchedElement);
            }
            if (searchCompletedModuleName !== null) {
                const searchedElement = leaderboardData.filter(element =>
                    (element.completedModuleName.length == 0 && searchCompletedModuleName.length == 0) ||
                    (element.completedModuleName.some(mod => searchCompletedModuleName.includes(mod)))
                );
                if (searchedElement)
                    searchedLeaderboardData.push(...searchedElement);
            }
            if (searchUserCode !== null || searchCompletedModuleName !== null) {
                console.log(searchedLeaderboardData);
                preRes.data = searchedLeaderboardData;
                return res.status(201).json(searchedLeaderboardData);
            }
            console.log(leaderboardData);
            preRes.data = leaderboardData;
            return res.status(201).json(leaderboardData);
        })
        .catch(err => {
            console.log(err);
            preRes.success = false;
            preRes.message = `Couldn't create the leaderboard ${err}`;
            preRes.data = {};
            return res.status(500).json(preRes);
            //next(preRes);
        });
}


exports.downloadLeaderboard = (req, res, next) => {
    let preRes = {
        success: false,
        message: "",
        data: []
    }

    const fields = [
        {
            label: 'User Code',
            value: 'userCode'
        },
        {
            label: 'Name',
            value: 'name'
        },
        {
            label: 'Email Address',
            value: 'email'
        },
        {
            label: 'Completed Module Name',
            value: 'completedModuleName'
        },

        {
            label: 'Leaderboard',
            value: 'leaderboard'
        },
        {
            label: 'Mark',
            value: 'mark'
        }
    ];
    //const data = await users.findAll();

    //return downloadResource(res, 'users.csv', fields, data);
    let searchOptions = {};
    let searchUserCode = null, searchCompletedModuleName = null;
    if (req.body && Object.keys(req.body).length > 0) {
        if (req.body.userCode) {
            searchUserCode = req.body.userCode;
            //searchOptions.userCode = searchUserCode;
        }
        if (req.body.completedModuleName) {
            searchCompletedModuleName = req.body.completedModuleName;
            //searchOptions.completedModuleName = { $in: searchCompletedModuleName }
        }
    }
    let sortOrder = -1;

    if (req.query) {
        if (req.query.sortOrder === 'desc')
            sortOrder = 1;
    }

    ModuleReport.find(searchOptions)
        .select('completedModuleName correctMark totalMark -_id')
        .populate('userId', 'name email userCode -_id')
        .sort({ correctMark: -1 })
        .then(result => {
            preRes.success = true;
            preRes.message = "Leaderboard Created Successfully"
            //preRes.data = [...result];
            let leaderboardrank = 0;
            const leaderboardData = [];
            [...result].forEach(element => {
                const { userCode, name, email } = element.userId;
                const reshapedObj = {
                    userCode: userCode,
                    name: name,
                    email: email,
                    completedModuleName: element.completedModuleName,
                    leaderboard: ++leaderboardrank,
                    mark: `${element.correctMark}/${element.totalMark}`
                };
                leaderboardData.push(reshapedObj);
            });
            if (sortOrder === 1) {
                leaderboardData.reverse();
            }
            let searchedLeaderboardData = [];
            if (searchUserCode !== null) {
                const searchedElement = leaderboardData.filter(element => element.userCode === searchUserCode);
                if (searchedElement)
                    searchedLeaderboardData.push(...searchedElement);
            }
            if (searchCompletedModuleName !== null) {
                const searchedElement = leaderboardData.filter(element =>
                    (element.completedModuleName.length == 0 && searchCompletedModuleName.length == 0) ||
                    (element.completedModuleName.some(mod => searchCompletedModuleName.includes(mod)))
                );
                if (searchedElement)
                    searchedLeaderboardData.push(...searchedElement);
            }
            if (searchUserCode !== null || searchCompletedModuleName !== null) {
                //console.log(searchedLeaderboardData);
                preRes.data = searchedLeaderboardData;
                return jtc.downloadResource(res, 'downloaded-leaderboard.csv', fields, leaderboardData);
            }
            //console.log(leaderboardData);
            preRes.data = leaderboardData;
            return jtc.downloadResource(res, 'downloaded-leaderboard.csv', fields, leaderboardData);
        })
        .catch(err => {
            console.log(err);
            preRes.success = false;
            preRes.message = `Couldn't create the leaderboard ${err}`;
            preRes.data = {};
            return res.status(500).json(preRes);
            //next(preRes);
        });

}