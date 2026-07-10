const express = require('express');
const router  = express.Router();
const { getAll, getPending, createPerson, deletePerson } = require('../controllers/personController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/',         authenticate,               getAll);
router.get('/pending',  authenticate,               getPending);
router.post('/',        authenticate,               createPerson);
router.delete('/:id',   authenticate, requireAdmin, deletePerson);

module.exports = router;
