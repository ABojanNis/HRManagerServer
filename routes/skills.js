const express = require('express');
const { body } = require('express-validator');

const skillsController = require('../controllers/skills');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, skillsController.getSkills);

router.post(
  '/',
  isAuth, 
  [
    body('description')
      .exists()
      .withMessage('Description field is required')
  ], 
  skillsController.postSkill);

router.put(
  '/:skillId',
  isAuth,
  [
    body('description')
      .exists()
      .withMessage('Description field is required')
  ],
  skillsController.putSkill);

router.delete('/:skillId', isAuth, skillsController.deleteSkill);

module.exports = router;