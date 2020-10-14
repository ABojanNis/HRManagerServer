const mongoose = require('mongoose');

const CounterModel = require('../utils/counter');

const SkillSchema = new mongoose.Schema({
    _id: {
      type: Number
    },
    description: {
      type: String,
      required: true
    }
  }
);

SkillSchema.pre('save', async function() {
  if(!this.isNew) return;

  const id = await CounterModel.increment('skillId');
  this._id = id;
});

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;