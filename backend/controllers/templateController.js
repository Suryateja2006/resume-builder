const Template = require('../models/Template');

// GET /api/templates — Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({}, '-__v');
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/templates/:id — Get single template schema
exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({ templateId: req.params.id });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
