const express = require('express');
const { body } = require('express-validator');

const candidatesController = require('../controllers/candidates');
const commentsController = require('../controllers/comments');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, candidatesController.getCandidates);

router.get('/:candidateId', isAuth, candidatesController.getCandidate);

router.post(
  '/',
  isAuth, 
  [
    body('name')
      .exists()
      .withMessage('Name field is required'),
    body('surname')
      .exists()
      .withMessage('Surname field is required')
  ], 
  candidatesController.postCandidate);

router.put(
  '/:candidateId',
  isAuth,
  [
    body('name')
      .exists()
      .withMessage('Name field is required'),
    body('surname')
      .exists()
      .withMessage('Surname field is required')
  ],
  candidatesController.putCandidate);

router.delete('/:candidateId', isAuth, candidatesController.deleteCandidate);

router.post(
  '/:candidateId/comments',
  isAuth,
  [
    body('body')
      .exists()
      .withMessage('Comment field is required'),
    body('user')
      .exists()
      .withMessage('User field is required')
  ],
  commentsController.postComment);

router.put(
  '/comments/:commentId',
  isAuth,
  [
    body('body')
      .exists()
      .withMessage('Comment field is required')
  ],
  commentsController.putComment);

router.delete(
  '/:candidateId/comments/:commentId',
  isAuth,
  commentsController.deleteComment);

module.exports = router;