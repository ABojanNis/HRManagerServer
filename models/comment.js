const mongoose = require('mongoose');

const CounterModel = require('../utils/counter');

const CommentSchema = new mongoose.Schema({
    _id: {
      type: Number
    },
    body: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

CommentSchema.pre('save', async function() {
  if(!this.isNew) return;

  const id = await CounterModel.increment('commentId');
  this._id = id;
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;