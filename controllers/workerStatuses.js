const { validationResult } = require('express-validator');

const WorkerStatus = require('../models/workerStatus');

exports.getWorkerStatuses = (req, res, next) => {
  const search = req.query.q || '';
  const currentPage = Number(req.query.page) || 1;
  const perPage = Number(req.query.itemsPerPage) || 100;
  let total, totalPages;
  WorkerStatus.find({ description: { $regex: search, $options: "i" }})
    .countDocuments()
    .then(count => {
      total = count;
      totalPages = Math.ceil(count / perPage);
      return WorkerStatus.find({ description: { $regex: search, $options: "i" }}, {}, { sort: { _id: 1 } })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(workerStatuses => {
      res.status(200).json({ success: true, message: 'Ok', data: workerStatuses, meta: { pagination: { total, perPage, currentPage, totalPages } } });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};

exports.postWorkerStatus = (req, res, next) => {
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }

  const newWorkerStatus = new WorkerStatus({
    description: description
  });

  newWorkerStatus.save()
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'Worker status successfully created!',
        data: result
      });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putWorkerStatus = (req, res, next) => {
  const id = req.params.workerStatusId;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  
  WorkerStatus.findById(id)
    .then(workerStatus => {
      if(!workerStatus) {
        const error = new Error('Could not find worker status.');
        error.statusCode = 404;
        throw error;
      }
      workerStatus.description = description;
      return workerStatus.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Worker status succesfully edited!', workerStatus: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteWorkerStatus = (req, res, next) => {
  const id = req.params.workerStatusId;
  WorkerStatus.findById(id)
    .then(workerStatus => {
      if(!workerStatus) {
        const error = new Error('Could not find worker status.');
        error.statusCode = 404;
        throw error;
      }
      return WorkerStatus.findByIdAndDelete(id);
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Worker status succesfully deleted!', data: null });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

function escapeRegex(text) {
  if(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
};