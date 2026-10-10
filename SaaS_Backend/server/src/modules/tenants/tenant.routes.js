const express = require('express');
const router = express.Router();
const tenantController = require('./tenant.controller');
const verifyJWT = require('../../middleware/verifyJWT');

// Verify user login for protected routes
router.use(verifyJWT);

router.route('/')
    .post(tenantController.createTenant)
    .get(tenantController.getMyTenants);

module.exports = router;
