const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'tel', 'url', 'textarea', 'date', 'array'],
    default: 'text'
  },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  // For array-type fields (e.g., list of skills, experiences)
  subFields: [{
    name: { type: String },
    label: { type: String },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' }
  }]
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '📄' },
  repeatable: { type: Boolean, default: false },
  fields: [fieldSchema]
}, { _id: false });

const templateSchema = new mongoose.Schema({
  templateId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  colorScheme: {
    primary: { type: String, default: '#6366f1' },
    secondary: { type: String, default: '#8b5cf6' },
    accent: { type: String, default: '#06b6d4' },
    background: { type: String, default: '#ffffff' },
    text: { type: String, default: '#1e293b' }
  },
  sections: [sectionSchema],
  layout: {
    type: String,
    enum: ['single-column', 'two-column', 'modern', 'classic'],
    default: 'single-column'
  }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
