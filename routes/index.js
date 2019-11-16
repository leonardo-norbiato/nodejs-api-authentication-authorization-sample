const express = require("express");
const router = express.Router();

router.use('/users', require('../controllers/user.controller'));
router.use('/auth', require('../controllers/auth.controller'));

module.exports = router;