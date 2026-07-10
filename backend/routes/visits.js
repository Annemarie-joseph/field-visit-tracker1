const express = require('express');
const router  = express.Router();
const { logVisit } = require('../controllers/visitController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, logVisit);

module.exports = router;
