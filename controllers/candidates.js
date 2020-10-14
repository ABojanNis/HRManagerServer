const { validationResult } = require('express-validator');

const Candidate = require('../models/candidate');
const Comment = require('../models/comment');

exports.getCandidates = (req, res, next) => {
  const search = req.query.q;
  const currentPage = Number(req.query.page) || 1;
  const perPage = Number(req.query.itemsPerPage) || 100;
  let total, totalPages;
  Candidate.find({ name: { $regex: search, $options: "i" }})
    .countDocuments()
    .then(count => {
      total = count;
      totalPages = Math.ceil(count / perPage);
      return Candidate.find({ name: { $regex: search, $options: "i" }}, {}, { sort: { _id: -1 } })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(candidates => {
      res.status(200).json({ success: true, message: 'Ok', data: candidates, meta: { pagination: { total, perPage, currentPage, totalPages } } });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};

exports.getCandidate = (req, res, next) => {
  const id = req.params.candidateId;

  Candidate.findById(id).populate('comments')
    .then(candidate => {
      if(!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ success: true, message: 'Ok', data: candidate });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postCandidate = (req, res, next) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phone = req.body.phone;
  const linkedin = req.body.linkedin;
  const city = req.body.city;
  const education = req.body.education;
  const department = req.body.department;
  const primary_skill = req.body.primary_skill;
  const secondary_skill = req.body.secondary_skill;
  const other_skills = req.body.other_skills;
  const experience = req.body.experience;
  const status = req.body.status;
  const company = req.body.company;
  const desired_salary = req.body.desired_salary;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }

  const newCandidate = new Candidate({
    name,
    surname,
    email,
    phone,
    linkedin,
    city,
    education,
    department,
    primary_skill,
    secondary_skill,
    other_skills,
    experience,
    status,
    company,
    desired_salary
  });

  newCandidate.save()
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'Candidate successfully created!',
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

exports.putCandidate = (req, res, next) => {
  const id = req.params.candidateId;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phone = req.body.phone;
  const linkedin = req.body.linkedin;
  const city = req.body.city;
  const education = req.body.education;
  const department = req.body.department;
  const primary_skill = req.body.primary_skill;
  const secondary_skill = req.body.secondary_skill;
  const other_skills = req.body.other_skills;
  const experience = req.body.experience;
  const status = req.body.status;
  const company = req.body.company;
  const desired_salary = req.body.desired_salary;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  
  Candidate.findById(id)
    .then(candidate => {
      if(!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      candidate.name = name;
      candidate.surname = surname;
      candidate.email = email;
      candidate.phone = phone;
      candidate.linkedin = linkedin;
      candidate.city = city;
      candidate.education = education;
      candidate.department = department;
      candidate.primary_skill = primary_skill;
      candidate.secondary_skill = secondary_skill;
      candidate.other_skills = other_skills;
      candidate.experience = experience;
      candidate.status = status;
      candidate.company = company;
      candidate.desired_salary = desired_salary;
      return candidate.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Candidate succesfully edited!', candidate: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteCandidate = (req, res, next) => {
  const id = req.params.candidateId;
  Candidate.findById(id)
    .then(candidate => {
      if(!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      return Candidate.findByIdAndDelete(id);
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Candidate succesfully deleted!', data: null });
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