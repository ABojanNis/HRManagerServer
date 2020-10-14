const mongoose = require('mongoose');

const CounterModel = require('../utils/counter');

const WorkerStatusSchema = new mongoose.Schema({
    _id: {
      type: Number
    },
    description: {
      type: String,
      required: true
    }
  }
);

WorkerStatusSchema.pre('save', async function() {
  if(!this.isNew) return;

  const id = await CounterModel.increment('workerStatusId');
  this._id = id;
});

const WorkerStatus = mongoose.model('WorkerStatus', WorkerStatusSchema);

module.exports = WorkerStatus;