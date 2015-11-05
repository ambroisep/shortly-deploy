var mongoose = require('mongoose');

var urlsSchema = new mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number,
    created_at: Date,
    updated_at: Date
});

urlsSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var Link = mongoose.model('Link', urlsSchema);

module.exports = Link;