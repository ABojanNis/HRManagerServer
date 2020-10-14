const { validationResult } = require('express-validator');

const Candidate = require('../models/candidate');
const Comment = require('../models/comment');
const { findByIdAndDelete } = require('../models/candidate');

exports.postComment = (req, res, next) => {
  const id = req.params.candidateId;
  const body = req.body.body;
  const user = req.body.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  const newComment = new Comment({
    body,
    user
  });
  let savedComment
  newComment.save()
    .then(comment => {
      savedComment = comment;
      return Candidate.findById(id).populate('comments')
    })
    .then(candidate => {
      if(!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      candidate.comments.unshift(savedComment);
      return candidate.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Comment succesfully added!', candidate: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putComment = (req, res, next) => {
  const id = req.params.commentId;
  const body = req.body.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }

  Comment.findById(id)
    .then(comment => {
      if(!comment) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      comment.body = body;
      return comment.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'Comment succesfully edited!', comment: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const candidateId = req.params.candidateId;
  const commentId = req.params.commentId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  Comment.findById(commentId)
    .then(comment => {
      if(!comment) {
        const error = new Error('Could not find comment.');
        error.statusCode = 404;
        throw error;
      }
      return Comment.findByIdAndDelete(commentId);
    })
    .then(result => {
      return Candidate.findById(candidateId).populate('comments');
    })
    .then(candidate => {
      if(!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ success: true, message: 'Comment succesfully deleted!', candidate: candidate });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};