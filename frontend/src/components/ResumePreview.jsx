import InlineEdit from './InlineEdit';
import { useResume } from '../context/ResumeContext';

export default function ResumePreview({ template }) {
  const { resumeData, updateField, customSections, updateCustomField } = useResume();
  if (!template) return null;

  const colors = template.colorScheme || {};
  const primary = colors.primary || '#6366f1';
  const secondary = colors.secondary || '#8b5cf6';

  const pi = resumeData.personalInfo || {};
  const contactParts = [pi.email, pi.phone, pi.location, pi.linkedin, pi.website].filter(Boolean);

  const handleSave = (sectionId, fieldName, value, entryIndex = null) => {
    updateField(sectionId, fieldName, value, entryIndex);
  };

  return (
    <div className="resume-preview" style={{ fontSize: '11pt', lineHeight: 1.5 }}>
      <div style={{ padding: '32px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: `3px solid ${primary}` }}>
          <InlineEdit
            tag="h1"
            value={pi.fullName || ''}
            onSave={(v) => handleSave('personalInfo', 'fullName', v)}
            style={{ fontSize: '26pt', fontWeight: 700, color: primary, letterSpacing: '-0.5px', margin: 0, marginBottom: 8 }}
          />
          {contactParts.length > 0 && (
            <p style={{ fontSize: '9.5pt', color: '#64748b', letterSpacing: '0.5px', margin: 0 }}>
              {contactParts.join('  •  ')}
            </p>
          )}
        </div>

        {/* Sections */}
        {template.sections.map(section => {
          if (section.sectionId === 'personalInfo') return null;
          const sd = resumeData[section.sectionId];

          return (
            <div key={section.sectionId} style={{ marginBottom: 20 }}>
              <h2 style={{
                fontSize: '12pt', fontWeight: 700, color: primary,
                textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4, margin: 0
              }}>
                {section.title}
              </h2>
              <div style={{
                height: 2, marginBottom: 12, borderRadius: 1,
                background: `linear-gradient(to right, ${primary}, ${secondary}, transparent)`
              }} />

              {/* Summary section */}
              {section.sectionId === 'summary' && (
                <InlineEdit
                  tag="p"
                  value={sd?.summary || sd?.text || ''}
                  onSave={(v) => handleSave('summary', 'summary', v)}
                  style={{ fontSize: '10.5pt', color: '#475569', lineHeight: 1.6, margin: 0 }}
                />
              )}

              {/* Skills section */}
              {section.sectionId === 'skills' && (() => {
                const raw = sd?.skills || sd?.list || '';
                const arr = typeof raw === 'string' ? raw.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(raw) ? raw : []);
                return (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {arr.length > 0 ? arr.map((s, i) => (
                      <span key={i} style={{
                        display: 'inline-block', padding: '3px 12px',
                        background: `${primary}15`, color: primary,
                        border: `1px solid ${primary}30`, borderRadius: 4,
                        fontSize: '9.5pt', fontWeight: 500
                      }}>{typeof s === 'string' ? s : s.name}</span>
                    )) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '10pt' }}>Add skills in the form...</span>
                    )}
                  </div>
                );
              })()}

              {/* Repeatable sections */}
              {section.repeatable && section.sectionId !== 'skills' && (
                Array.isArray(sd) && sd.length > 0 ? sd.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: 14 }}>
                    {section.fields.map(f => {
                      const val = item[f.name];
                      if (f.name === 'startDate' || f.name === 'endDate' || f.name === 'date') return null;
                      if (!val && !['title', 'degree', 'organization', 'institution'].includes(f.name)) return null;

                      if (['title', 'degree', 'organization', 'institution'].includes(f.name)) {
                        return (
                          <InlineEdit key={f.name} tag="h3" value={val || ''}
                            onSave={(v) => handleSave(section.sectionId, f.name, v, idx)}
                            style={{ fontSize: '11pt', fontWeight: 600, color: '#1e293b', margin: 0 }}
                          />
                        );
                      }
                      if (['company', 'school', 'issuer'].includes(f.name)) {
                        return (
                          <InlineEdit key={f.name} tag="span" value={val || ''}
                            onSave={(v) => handleSave(section.sectionId, f.name, v, idx)}
                            style={{ fontSize: '10.5pt', color: secondary, fontWeight: 500 }}
                          />
                        );
                      }
                      if (['description', 'details'].includes(f.name)) {
                        return (
                          <InlineEdit key={f.name} tag="p" value={val || ''}
                            onSave={(v) => handleSave(section.sectionId, f.name, v, idx)}
                            style={{ fontSize: '10.5pt', color: '#475569', marginTop: 4, lineHeight: 1.55, marginBottom: 0 }}
                          />
                        );
                      }
                      if (['url', 'link'].includes(f.name)) {
                        return <a key={f.name} href={val} style={{ fontSize: '9.5pt', color: '#06b6d4', display: 'block' }}>{val}</a>;
                      }
                      return (
                        <InlineEdit key={f.name} tag="span" value={val || ''}
                          onSave={(v) => handleSave(section.sectionId, f.name, v, idx)}
                          style={{ fontSize: '10.5pt', color: '#475569', display: 'block' }}
                        />
                      );
                    })}
                    {(item.startDate || item.endDate || item.date) && (
                      <span style={{ fontSize: '9.5pt', color: '#94a3b8', float: 'right', marginTop: -18 }}>
                        {item.startDate || item.date || ''}{item.endDate ? ` — ${item.endDate}` : ''}
                      </span>
                    )}
                    <div style={{ clear: 'both' }} />
                  </div>
                )) : (
                  <p style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '10pt', margin: 0 }}>
                    Add entries in the form to see them here...
                  </p>
                )
              )}

              {/* Generic non-repeatable (not summary/skills) */}
              {!section.repeatable && section.sectionId !== 'summary' && section.sectionId !== 'skills' && sd && (
                section.fields.map(f => sd[f.name] ? (
                  <InlineEdit key={f.name} tag="p" value={sd[f.name]}
                    onSave={(v) => handleSave(section.sectionId, f.name, v)}
                    style={{ fontSize: '10.5pt', color: '#475569', marginBottom: 4, margin: 0 }}
                  />
                ) : null)
              )}
            </div>
          );
        })}

        {/* Custom sections */}
        {customSections.map(cs => (
          <div key={cs.sectionId} style={{ marginBottom: 20 }}>
            <h2 style={{
              fontSize: '12pt', fontWeight: 700, color: primary,
              textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4, margin: 0
            }}>
              {cs.icon} {cs.title}
            </h2>
            <div style={{
              height: 2, marginBottom: 12, borderRadius: 1,
              background: `linear-gradient(to right, ${primary}, ${secondary}, transparent)`
            }} />
            {cs.repeatable && Array.isArray(cs.data) ? (
              cs.data.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  {cs.fields.map(f => item[f.name] ? (
                    <InlineEdit key={f.name} tag="p" value={item[f.name]}
                      onSave={(v) => updateCustomField(cs.sectionId, f.name, v, idx)}
                      style={{ fontSize: '10.5pt', color: '#475569', margin: 0, marginBottom: 2 }}
                    />
                  ) : null)}
                </div>
              ))
            ) : (
              cs.fields.map(f => cs.data?.[f.name] ? (
                <InlineEdit key={f.name} tag="p" value={cs.data[f.name]}
                  onSave={(v) => updateCustomField(cs.sectionId, f.name, v)}
                  style={{ fontSize: '10.5pt', color: '#475569', margin: 0, marginBottom: 2 }}
                />
              ) : null)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
