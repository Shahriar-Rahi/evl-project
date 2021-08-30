const express = require('express');
const mongoConnection = require('./utils/mongo-connect');
const userRouter = require('./routes/user');
const moduleReportRouter = require('./routes/module-report');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(moduleReportRouter);
app.use(leaderboardRouter);
mongoConnection;
app.listen(4000, () => {
    console.log('starting up...')
});