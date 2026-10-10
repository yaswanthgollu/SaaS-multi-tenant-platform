const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyTenant = require('../tenants/tenant.middleware');

// Protect ALL task endpoints with double security layer
router.use(verifyJWT);
router.use(verifyTenant);

router.route('/')
    .post(taskController.createTask)
    .get(taskController.getTasks);

router.route('/:id')
    .patch(taskController.updateTaskStatus)
    .delete(taskController.deleteTask);

module.exports = router;