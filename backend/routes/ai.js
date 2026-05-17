const express = require('express');
const router = express.Router();
const { improveText } = require('../controllers/aiController');

router.post('/improve', improveText);

module.exports = router;
