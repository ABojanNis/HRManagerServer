const { validationResult } = require('express-validator');

const Experience = require('../models/experience');

exports.getExperiences = (req, res, next) => {
  const search = req.query.q || '';
  const currentPage = Number(req.query.page) || 1;
  const perPage = Number(req.query.itemsPerPage) || 100;
  let total, totalPages;
  Experience.find({ name: { $regex: search, $options: "i" }})
    .countDocuments()
    .then(count => {
      total = count;
      totalPages = Math.ceil(count / perPage);
      return Experience.find({ name: { $regex: search, $options: "i" }}, {}, { sort: { _id: 1 } })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(experiences => {
      res.status(200).json({ success: true, message: 'Ok', data: experiences, meta: { pagination: { total, perPage, currentPage, totalPages } } });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};

exports.postExperience = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }

  const newExperience = new Experience({
    name: name,
    description: description
  });

  newExperience.save()
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'Experience successfully created!',
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

exports.putExperience = (req, res, next) => {
  const id = req.params.experienceId;
  const name = req.body.name;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  
  Experience.findById(id)
    .then(experience => {
      if(!experience) {
        const error = new Error('Could not find experience.');
        error.statusCode = 404;
        throw error;
      }
      experience.name = name;
      experience.description = description;
      return experience.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Experience succesfully edited!', experience: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteExperience = (req, res, next) => {
  const id = req.params.experienceId;
  Experience.findById(id)
    .then(experience => {
      if(!experience) {
        const error = new Error('Could not find experience.');
        error.statusCode = 404;
        throw error;
      }
      return Experience.findByIdAndDelete(id);
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Experience succesfully deleted!', data: null });
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