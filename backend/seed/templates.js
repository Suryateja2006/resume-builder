require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Template = require('../models/Template');

const templates = [
  {
    templateId: 't1',
    name: 'Modern Professional',
    description: 'Clean, modern layout with vibrant colors. Perfect for tech and creative professionals.',
    thumbnail: 'modern',
    colorScheme: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4', background: '#ffffff', text: '#1e293b' },
    layout: 'modern',
    sections: [
      {
        sectionId: 'personalInfo', title: 'Personal Info', icon: '👤',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'linkedin.com/in/johndoe' },
          { name: 'website', label: 'Website', type: 'url', placeholder: 'johndoe.dev' }
        ]
      },
      {
        sectionId: 'summary', title: 'Professional Summary', icon: '📝',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief professional summary...' }
        ]
      },
      {
        sectionId: 'experience', title: 'Work Experience', icon: '💼', repeatable: true,
        fields: [
          { name: 'title', label: 'Job Title', type: 'text', placeholder: 'Senior Software Engineer' },
          { name: 'company', label: 'Company', type: 'text', placeholder: 'Google' },
          { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'Jan 2020' },
          { name: 'endDate', label: 'End Date', type: 'text', placeholder: 'Present' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Key responsibilities and achievements...' }
        ]
      },
      {
        sectionId: 'education', title: 'Education', icon: '🎓', repeatable: true,
        fields: [
          { name: 'degree', label: 'Degree', type: 'text', placeholder: 'B.S. Computer Science' },
          { name: 'school', label: 'School', type: 'text', placeholder: 'Stanford University' },
          { name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2016' },
          { name: 'endDate', label: 'End Date', type: 'text', placeholder: '2020' },
          { name: 'description', label: 'Details', type: 'textarea', placeholder: 'GPA, honors, relevant coursework...' }
        ]
      },
      {
        sectionId: 'skills', title: 'Skills', icon: '⚡',
        fields: [
          { name: 'skills', label: 'Skills', type: 'textarea', placeholder: 'JavaScript, React, Node.js, Python...' }
        ]
      },
      {
        sectionId: 'projects', title: 'Projects', icon: '🚀', repeatable: true,
        fields: [
          { name: 'title', label: 'Project Name', type: 'text', placeholder: 'E-commerce Platform' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Built a full-stack...' },
          { name: 'url', label: 'Link', type: 'url', placeholder: 'https://github.com/...' }
        ]
      }
    ]
  },
  {
    templateId: 't2',
    name: 'Classic Elegant',
    description: 'Traditional resume format with elegant typography. Ideal for corporate and business roles.',
    thumbnail: 'classic',
    colorScheme: { primary: '#1e40af', secondary: '#3b82f6', accent: '#10b981', background: '#ffffff', text: '#111827' },
    layout: 'classic',
    sections: [
      {
        sectionId: 'personalInfo', title: 'Personal Info', icon: '👤',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Smith', required: true },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'linkedin.com/in/janesmith' }
        ]
      },
      {
        sectionId: 'summary', title: 'Objective', icon: '🎯',
        fields: [
          { name: 'summary', label: 'Career Objective', type: 'textarea', placeholder: 'Dedicated professional seeking...' }
        ]
      },
      {
        sectionId: 'experience', title: 'Professional Experience', icon: '💼', repeatable: true,
        fields: [
          { name: 'title', label: 'Position', type: 'text', placeholder: 'Marketing Manager' },
          { name: 'company', label: 'Organization', type: 'text', placeholder: 'McKinsey & Company' },
          { name: 'startDate', label: 'From', type: 'text', placeholder: 'March 2019' },
          { name: 'endDate', label: 'To', type: 'text', placeholder: 'Present' },
          { name: 'description', label: 'Responsibilities', type: 'textarea', placeholder: 'Led team of 12...' }
        ]
      },
      {
        sectionId: 'education', title: 'Education', icon: '🎓', repeatable: true,
        fields: [
          { name: 'degree', label: 'Qualification', type: 'text', placeholder: 'MBA, Finance' },
          { name: 'school', label: 'Institution', type: 'text', placeholder: 'Harvard Business School' },
          { name: 'startDate', label: 'Year Started', type: 'text', placeholder: '2015' },
          { name: 'endDate', label: 'Year Completed', type: 'text', placeholder: '2017' }
        ]
      },
      {
        sectionId: 'skills', title: 'Core Competencies', icon: '⚡',
        fields: [
          { name: 'skills', label: 'Skills', type: 'textarea', placeholder: 'Leadership, Strategy, Analytics...' }
        ]
      },
      {
        sectionId: 'certifications', title: 'Certifications', icon: '📜', repeatable: true,
        fields: [
          { name: 'title', label: 'Certification', type: 'text', placeholder: 'PMP Certified' },
          { name: 'issuer', label: 'Issuing Body', type: 'text', placeholder: 'PMI' },
          { name: 'date', label: 'Date', type: 'text', placeholder: '2021' }
        ]
      }
    ]
  },
  {
    templateId: 't3',
    name: 'Creative Designer',
    description: 'Bold and colorful layout for creative professionals. Stand out with vibrant design.',
    thumbnail: 'creative',
    colorScheme: { primary: '#e11d48', secondary: '#f43f5e', accent: '#f59e0b', background: '#ffffff', text: '#18181b' },
    layout: 'two-column',
    sections: [
      {
        sectionId: 'personalInfo', title: 'About Me', icon: '🎨',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Alex Rivera', required: true },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'alex@design.co', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 0123' },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'Los Angeles, CA' },
          { name: 'website', label: 'Portfolio', type: 'url', placeholder: 'alexrivera.design' }
        ]
      },
      {
        sectionId: 'summary', title: 'Creative Statement', icon: '✨',
        fields: [
          { name: 'summary', label: 'Statement', type: 'textarea', placeholder: 'Passionate designer with...' }
        ]
      },
      {
        sectionId: 'experience', title: 'Experience', icon: '💼', repeatable: true,
        fields: [
          { name: 'title', label: 'Role', type: 'text', placeholder: 'Lead Designer' },
          { name: 'company', label: 'Studio/Company', type: 'text', placeholder: 'Figma' },
          { name: 'startDate', label: 'Start', type: 'text', placeholder: '2021' },
          { name: 'endDate', label: 'End', type: 'text', placeholder: 'Present' },
          { name: 'description', label: 'Highlights', type: 'textarea', placeholder: 'Redesigned the entire...' }
        ]
      },
      {
        sectionId: 'skills', title: 'Design Skills', icon: '🎯',
        fields: [
          { name: 'skills', label: 'Skills', type: 'textarea', placeholder: 'Figma, Adobe Creative Suite, UI/UX...' }
        ]
      },
      {
        sectionId: 'projects', title: 'Portfolio Projects', icon: '🖼️', repeatable: true,
        fields: [
          { name: 'title', label: 'Project', type: 'text', placeholder: 'Brand Redesign' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Complete rebrand for...' },
          { name: 'url', label: 'Portfolio Link', type: 'url', placeholder: 'https://dribbble.com/...' }
        ]
      },
      {
        sectionId: 'education', title: 'Education', icon: '🎓', repeatable: true,
        fields: [
          { name: 'degree', label: 'Degree', type: 'text', placeholder: 'BFA Graphic Design' },
          { name: 'school', label: 'School', type: 'text', placeholder: 'RISD' },
          { name: 'endDate', label: 'Year', type: 'text', placeholder: '2019' }
        ]
      }
    ]
  },
  {
    templateId: 't4',
    name: 'Minimal Clean',
    description: 'Minimalist design with focus on content. Perfect for academic and research positions.',
    thumbnail: 'minimal',
    colorScheme: { primary: '#0f766e', secondary: '#14b8a6', accent: '#6366f1', background: '#ffffff', text: '#1e293b' },
    layout: 'single-column',
    sections: [
      {
        sectionId: 'personalInfo', title: 'Contact', icon: '📧',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Dr. Sarah Chen', required: true },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'sarah@university.edu', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 0456' },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'Boston, MA' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'linkedin.com/in/sarahchen' },
          { name: 'website', label: 'Personal Site', type: 'url', placeholder: 'sarahchen.io' }
        ]
      },
      {
        sectionId: 'summary', title: 'Research Interests', icon: '🔬',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'My research focuses on...' }
        ]
      },
      {
        sectionId: 'experience', title: 'Research Experience', icon: '🧪', repeatable: true,
        fields: [
          { name: 'title', label: 'Position', type: 'text', placeholder: 'Research Scientist' },
          { name: 'company', label: 'Institution', type: 'text', placeholder: 'MIT CSAIL' },
          { name: 'startDate', label: 'From', type: 'text', placeholder: '2020' },
          { name: 'endDate', label: 'To', type: 'text', placeholder: 'Present' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Published 5 papers...' }
        ]
      },
      {
        sectionId: 'education', title: 'Education', icon: '🎓', repeatable: true,
        fields: [
          { name: 'degree', label: 'Degree', type: 'text', placeholder: 'Ph.D. Computer Science' },
          { name: 'school', label: 'University', type: 'text', placeholder: 'MIT' },
          { name: 'startDate', label: 'From', type: 'text', placeholder: '2016' },
          { name: 'endDate', label: 'To', type: 'text', placeholder: '2021' },
          { name: 'description', label: 'Thesis/Details', type: 'textarea', placeholder: 'Thesis: Deep learning for...' }
        ]
      },
      {
        sectionId: 'skills', title: 'Technical Skills', icon: '💻',
        fields: [
          { name: 'skills', label: 'Skills', type: 'textarea', placeholder: 'Python, PyTorch, TensorFlow...' }
        ]
      },
      {
        sectionId: 'publications', title: 'Publications', icon: '📄', repeatable: true,
        fields: [
          { name: 'title', label: 'Title', type: 'text', placeholder: 'Deep Learning for NLP' },
          { name: 'description', label: 'Citation', type: 'textarea', placeholder: 'Chen et al., NeurIPS 2023...' },
          { name: 'url', label: 'DOI/Link', type: 'url', placeholder: 'https://doi.org/...' }
        ]
      }
    ]
  }
];

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Template.deleteMany({});
    console.log('Cleared existing templates');
    await Template.insertMany(templates);
    console.log(`✅ Seeded ${templates.length} templates successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedTemplates();
