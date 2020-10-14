const mongoose = require('mongoose');

const CounterModel = require('../utils/counter');

const CandidateSchema = new mongoose.Schema({
    _id: {
      type: Number
    },
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    linkedin: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    education: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false
    },
    primary_skill: {
      type: String,
      required: false
    },
    secondary_skill: {
      type: String,
      required: false
    },
    other_skills: {
      type: String,
      required: false
    },
    experience: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: false
    },
    company: {
      type: String,
      required: false
    },
    desired_salary: {
      type: String,
      required: false
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  { timestamps: true }
);

CandidateSchema.pre('save', async function() {
  if(!this.isNew) return;

  const id = await CounterModel.increment('candidateId');
  this._id = id;
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;