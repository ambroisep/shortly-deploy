// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

//var url = 'mongodb://MongoLab-9:1lDpy0un8RzgnpxNMzif371nh_lkaQblAmF.D1jiwLM-@ds048368.mongolab.com:48368/MongoLab-9';
var url = process.env["production"] ? 'mongodb://MongoLab-9:1lDpy0un8RzgnpxNMzif371nh_lkaQblAmF.D1jiwLM-@ds048368.mongolab.com:48368/MongoLab-9' : 'mongodb://localhost:27017/shortly';
mongoose.connect(url);

var db = mongoose.connection;

module.exports = db;
