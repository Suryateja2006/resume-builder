const express = require('express');
const router = express.Router();
const { getAllTemplates, getTemplate } = require('../controllers/templateController');

router.get('/', getAllTemplates);
router.get('/:id', getTemplate);

module.exports = router;
