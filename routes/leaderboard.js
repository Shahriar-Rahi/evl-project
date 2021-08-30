const express = require('express');
const leaderboardController = require('../controllers/leaderboard')
const router = express.Router();


router.post('/show-leaderboard', leaderboardController.showLeaderboard);

module.exports = router;