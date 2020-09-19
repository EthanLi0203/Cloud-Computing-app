const express = require('express');
const router = express.Router();
const { time } = require('../controllers/index');

router.get('/index', time);

module.exports = router;