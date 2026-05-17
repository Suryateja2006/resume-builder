const express = require('express');
const router = express.Router();
const {
  createResume,
  getAllResumes,
  getResume,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');
const { exportPDF, previewHTML } = require('../controllers/exportController');

router.post('/', createResume);
router.get('/', getAllResumes);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

// Export routes
router.get('/:id/export/pdf', exportPDF);
router.get('/:id/preview/html', previewHTML);

module.exports = router;
