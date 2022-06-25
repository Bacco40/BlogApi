var mongoose = require('mongoose');
const { DateTime } = require("luxon");


var Schema = mongoose.Schema;

var PostSchema = new Schema(
  {
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true, maxLength: 50},
    image_url: {type: String},
    isPublished: {type: Boolean, required: true, default:true},
    post: {type: String, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    date_of_creation: {type: Date, required: true, default: Date.now},
  }
);

// Virtual for member's URL
PostSchema
.virtual('url')
.get(function () {
  return '/post/' + this._id;
});

// Virtual for member's URL
PostSchema
.virtual('date_formatted')
.get(function () {
  return DateTime.fromJSDate(this.date_of_creation).toLocaleString(DateTime.DATE_MED);
});

//Export model
module.exports = mongoose.model('Post', PostSchema);