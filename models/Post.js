var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

var newSchema = new Schema({
  'title': { type: String },
  'image': { type: String },
  'content': { type: String },
  'tags' : { type: Array, default: [] },
  'permalink': { type: String },
  'like_count' : { type: Number, default : 0},
  'comments': { type: Array },
  'comment_count' : { type: Number, default: 0},
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});


module.exports = mongoose.model('Post', newSchema);
