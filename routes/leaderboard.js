const express = require('express');
const leaderboardController = require('../controllers/leaderboard')
const router = express.Router();


router.post('/show-leaderboard', leaderboardController.showLeaderboard);
router.post('/download-leaderboard', leaderboardController.downloadLeaderboard);

module.exports = router;