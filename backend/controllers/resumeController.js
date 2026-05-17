const Resume = require('../models/Resume');
const Template = require('../models/Template');

// POST /api/resume — Create resume
exports.createResume = async (req, res) => {
  try {
    const { templateId, data, title } = req.body;

    // Validate template exists
    const template = await Template.findOne({ templateId });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const resume = await Resume.create({
      templateId,
      title: title || `${template.name} Resume`,
      data: data || {},
      status: 'draft'
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/resume — Get all resumes
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({}).sort({ updatedAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/resume/:id — Fetch resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/resume/:id — Update resume data (inline editing support)
exports.updateResume = async (req, res) => {
  try {
    const { data, title, customSections, status } = req.body;
    const updateFields = { lastSavedAt: new Date() };

    if (data !== undefined) updateFields.data = data;
    if (title !== undefined) updateFields.title = title;
    if (customSections !== undefined) updateFields.customSections = customSections;
    if (status !== undefined) updateFields.status = status;

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/resume/:id — Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
