const mongoose = require('mongoose');

const connectURI = 'mongodb://test:test@localhost:27017/ergo?authSource=cbex'

const connectionOptions = {
    useNewUrlParser: true
}

const mongoConnection = mongoose.connect(connectURI, connectionOptions)
    .then(() => console.log(`Mongo Connection OK`))
    .catch(err => console.log(`Mongo Connection Error : ${err}`));

//module.exports = mongoConnection;
exports.mongoConnection;