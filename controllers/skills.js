const { validationResult } = require('express-validator');

const Skill = require('../models/skill');

exports.getSkills = (req, res, next) => {
  const search = req.query.q || '';
  const currentPage = Number(req.query.page) || 1;
  const perPage = Number(req.query.itemsPerPage) || 100;
  let total, totalPages;
  Skill.find({ description: { $regex: search, $options: "i" }})
    .countDocuments()
    .then(count => {
      total = count;
      totalPages = Math.ceil(count / perPage);
      return Skill.find({ description: { $regex: search, $options: "i" }}, {}, { sort: { _id: 1 } })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(skills => {
      res.status(200).json({ success: true, message: 'Ok', data: skills, meta: { pagination: { total, perPage, currentPage, totalPages } } });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};

exports.postSkill = (req, res, next) => {
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }

  const newSkill = new Skill({
    description: description
  });

  newSkill.save()
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'Skill successfully created!',
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

exports.putSkill = (req, res, next) => {
  const id = req.params.skillId;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  
  Skill.findById(id)
    .then(skill => {
      if(!skill) {
        const error = new Error('Could not find skill.');
        error.statusCode = 404;
        throw error;
      }
      skill.description = description;
      return skill.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Skill succesfully edited!', skill: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteSkill = (req, res, next) => {
  const id = req.params.skillId;
  Skill.findById(id)
    .then(skill => {
      if(!skill) {
        const error = new Error('Could not find skill.');
        error.statusCode = 404;
        throw error;
      }
      return Skill.findByIdAndDelete(id);
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Skill succesfully deleted!', data: null });
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