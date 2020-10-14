const mongoose = require('mongoose');

const CounterModel = require('../utils/counter');

const ExperienceSchema = new mongoose.Schema({
    _id: {
      type: Number
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
);

ExperienceSchema.pre('save', async function() {
  if(!this.isNew) return;

  const id = await CounterModel.increment('experienceId');
  this._id = id;
});

const Experience = mongoose.model('Experience', ExperienceSchema);

module.exports = Experience;