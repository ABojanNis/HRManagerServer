const mongoose = require('mongoose');

const CounterModel = require('../utils/counter');

const UserSchema = new mongoose.Schema({
  _id: {
    type: Number
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  is_admin: {
    type: Boolean,
    required: true
  }
});

UserSchema.pre('save', async function() {
  if(!this.isNew) return;

  const id = await CounterModel.increment('userId');
  this._id = id;
});

const User = mongoose.model('User', UserSchema);

module.exports = User;