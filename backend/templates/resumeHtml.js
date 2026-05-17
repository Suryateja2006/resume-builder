/**
 * Generates a full HTML document for resume PDF rendering.
 */
function generateResumeHTML(resume, template) {
  const data = resume.data || {};
  const c = template.colorScheme || {};
  const primary = c.primary || '#6366f1';
  const secondary = c.secondary || '#8b5cf6';
  const accent = c.accent || '#06b6d4';

  const pi = data.personalInfo || {};
  const fullName = pi.fullName || 'Your Name';
  const contactParts = [pi.email, pi.phone, pi.location, pi.linkedin, pi.website].filter(Boolean);

  let body = '';

  for (const section of template.sections) {
    if (section.sectionId === 'personalInfo') continue;
    const sd = data[section.sectionId];
    if (!sd) continue;

    if (section.sectionId === 'summary') {
      const txt = typeof sd === 'string' ? sd : (sd.summary || sd.text || '');
      if (txt) body += sectionBlock(section.title, `<p style="color:#475569;line-height:1.6">${txt}</p>`, primary, secondary);
      continue;
    }

    if (section.sectionId === 'skills') {
      const raw = sd.skills || sd.list || sd;
      let arr = [];
      if (typeof raw === 'string') arr = raw.split(',').map(s => s.trim()).filter(Boolean);
      else if (Array.isArray(raw)) arr = raw.map(s => typeof s === 'string' ? s : s.name || '').filter(Boolean);
      if (arr.length) {
        const tags = arr.map(s => `<span style="display:inline-block;padding:3px 12px;background:${primary}12;color:${primary};border:1px solid ${primary}30;border-radius:4px;font-size:9.5pt;font-weight:500;margin:3px">${s}</span>`).join('');
        body += sectionBlock(section.title, `<div style="display:flex;flex-wrap:wrap;gap:4px">${tags}</div>`, primary, secondary);
      }
      continue;
    }

    if (section.repeatable && Array.isArray(sd)) {
      let entries = '';
      for (const item of sd) {
        let e = '';
        for (const f of section.fields) {
          const v = item[f.name];
          if (!v) continue;
          if (['title','degree','organization','institution'].includes(f.name)) e += `<h3 style="font-size:11pt;font-weight:600;color:#1e293b">${v}</h3>`;
          else if (['company','school','issuer'].includes(f.name)) e += `<span style="font-size:10.5pt;color:${secondary};font-weight:500">${v}</span>`;
          else if (['description','details'].includes(f.name)) e += `<p style="font-size:10.5pt;color:#475569;margin-top:4px">${v}</p>`;
          else if (!['startDate','endDate','date'].includes(f.name)) e += `<span style="font-size:10.5pt;color:#475569;display:block">${v}</span>`;
        }
        const ds = item.startDate || item.date || '';
        const de = item.endDate || '';
        if (ds || de) e += `<span style="font-size:9.5pt;color:#94a3b8;float:right;margin-top:-18px">${ds}${de ? ' — '+de : ''}</span>`;
        entries += `<div style="margin-bottom:14px">${e}</div>`;
      }
      body += sectionBlock(section.title, entries, primary, secondary);
    } else {
      let content = '';
      for (const f of section.fields) {
        if (sd[f.name]) content += `<p style="font-size:10.5pt;color:#475569;margin-bottom:4px"><strong style="color:#334155">${f.label}:</strong> ${sd[f.name]}</p>`;
      }
      if (content) body += sectionBlock(section.title, content, primary, secondary);
    }
  }

  // Custom sections
  if (resume.customSections) {
    for (const cs of resume.customSections) {
      if (!cs.data) continue;
      let content = '';
      if (cs.repeatable && Array.isArray(cs.data)) {
        for (const item of cs.data) {
          for (const f of cs.fields) {
            if (item[f.name]) content += `<p style="font-size:10.5pt;color:#475569"><strong>${f.label}:</strong> ${item[f.name]}</p>`;
          }
          content += '<hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0">';
        }
      } else {
        for (const f of cs.fields) {
          if (cs.data[f.name]) content += `<p style="font-size:10.5pt;color:#475569"><strong>${f.label}:</strong> ${cs.data[f.name]}</p>`;
        }
      }
      body += sectionBlock(`${cs.icon||'📝'} ${cs.title}`, content, primary, secondary);
    }
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>${fullName} - Resume</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;color:#1e293b;background:#fff;font-size:11pt;line-height:1.5}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div style="max-width:210mm;margin:0 auto;padding:32px 40px">
<div style="text-align:center;margin-bottom:24px;padding-bottom:20px;border-bottom:3px solid ${primary}">
<h1 style="font-size:28pt;font-weight:700;color:${primary};letter-spacing:-0.5px;margin-bottom:8px">${fullName}</h1>
${contactParts.length ? `<p style="font-size:9.5pt;color:#64748b;letter-spacing:0.5px">${contactParts.join('  •  ')}</p>` : ''}
</div>
${body}
</div></body></html>`;
}

function sectionBlock(title, content, primary, secondary) {
  return `<div style="margin-bottom:20px">
<h2 style="font-size:12pt;font-weight:700;color:${primary};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px">${title}</h2>
<div style="height:2px;background:linear-gradient(to right,${primary},${secondary},transparent);margin-bottom:12px;border-radius:1px"></div>
${content}</div>`;
}

module.exports = { generateResumeHTML };
