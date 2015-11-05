// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/shortly';
mongoose.connect(url);

var db = mongoose.connection;

module.exports = db;
