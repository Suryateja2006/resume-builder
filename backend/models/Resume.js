const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true,
    ref: 'Template'
  },
  title: {
    type: String,
    default: 'Untitled Resume'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  // Custom sections added by user
  customSections: [{
    sectionId: { type: String },
    title: { type: String },
    icon: { type: String, default: '📝' },
    repeatable: { type: Boolean, default: false },
    fields: [{
      name: { type: String },
      label: { type: String },
      type: { type: String, default: 'text' },
      placeholder: { type: String, default: '' }
    }],
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  }],
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  lastSavedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
