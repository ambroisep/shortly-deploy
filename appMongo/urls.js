var mongoose = require('mongoose');
var crypto = require('crypto');

var urlsSchema = new mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: {type: Number, default: 0},
    created_at: Date,
    updated_at: Date
});

urlsSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  if ( !this.code ) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
  }
  next();
});

var Link = mongoose.model('Link', urlsSchema);

module.exports = Link;