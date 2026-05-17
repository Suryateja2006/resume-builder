const Resume = require('../models/Resume');
const Template = require('../models/Template');
const puppeteer = require('puppeteer');
const { generateResumeHTML } = require('../templates/resumeHtml');

// GET /api/resume/:id/export/pdf — Generate and download PDF
exports.exportPDF = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const template = await Template.findOne({ templateId: resume.templateId });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    // Generate HTML from resume data and template
    const html = generateResumeHTML(resume, template);

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });

    await browser.close();

    // Set headers and send PDF
    const filename = `${(resume.data?.personalInfo?.fullName || 'resume').replace(/\s+/g, '_')}_resume.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF: ' + error.message });
  }
};

// GET /api/resume/:id/preview/html — Get HTML preview
exports.previewHTML = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const template = await Template.findOne({ templateId: resume.templateId });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const html = generateResumeHTML(resume, template);
    res.json({ success: true, data: { html } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
