const express = require('express');
const { body } = require('express-validator');

const experiencesController = require('../controllers/experiences');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, experiencesController.getExperiences);

router.post(
  '/',
  isAuth, 
  [
    body('description')
      .exists()
      .withMessage('Description field is required')
  ], 
  experiencesController.postExperience);

router.put(
  '/:experienceId',
  isAuth,
  [
    body('description')
      .exists()
      .withMessage('Description field is required')
  ],
  experiencesController.putExperience);

router.delete('/:experienceId', isAuth, experiencesController.deleteExperience);

module.exports = router;