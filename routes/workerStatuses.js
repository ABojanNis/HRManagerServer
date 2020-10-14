const express = require('express');
const { body } = require('express-validator');

const workerStatusesController = require('../controllers/workerStatuses');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, workerStatusesController.getWorkerStatuses);

router.post(
  '/',
  isAuth, 
  [
    body('description')
      .exists()
      .withMessage('Description field is required')
  ], 
  workerStatusesController.postWorkerStatus);

router.put(
  '/:workerStatusId',
  isAuth,
  [
    body('description')
      .exists()
      .withMessage('Description field is required')
  ],
  workerStatusesController.putWorkerStatus);

router.delete('/:workerStatusId', isAuth, workerStatusesController.deleteWorkerStatus);

module.exports = router;