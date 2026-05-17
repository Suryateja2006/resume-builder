import { useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import AIButton from './AIButton';

export default function DynamicForm({ sections }) {
  const { resumeData, updateField, addEntry, removeEntry, autoSave } = useResume();

  useEffect(() => { autoSave(); }, [resumeData]);

  const renderField = (section, field, entryIndex = null) => {
    const sectionId = section.sectionId;
    let value = '';
    if (entryIndex !== null) {
      value = resumeData[sectionId]?.[entryIndex]?.[field.name] || '';
    } else {
      value = resumeData[sectionId]?.[field.name] || '';
    }

    const onChange = (e) => updateField(sectionId, field.name, e.target.value, entryIndex);
    const onAIAccept = (improved) => updateField(sectionId, field.name, improved, entryIndex);
    const showAI = field.type === 'textarea' || ['description', 'summary', 'details', 'text'].includes(field.name);
    const inputId = `field-${sectionId}-${field.name}${entryIndex !== null ? `-${entryIndex}` : ''}`;

    return (
      <div key={inputId} className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {showAI && value.length > 3 && (
            <AIButton text={value} onAccept={onAIAccept} context={section.title} />
          )}
        </div>
        {field.type === 'textarea' ? (
          <textarea
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder}
            className="input-field resize-none"
            rows={3}
          />
        ) : (
          <input
            id={inputId}
            type={field.type || 'text'}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder}
            className="input-field"
          />
        )}
      </div>
    );
  };

  const renderSection = (section) => {
    const isRepeatable = section.repeatable;
    const entries = resumeData[section.sectionId];
    const entryCount = Array.isArray(entries) ? entries.length : 0;

    return (
      <div key={section.sectionId}
        className="glass rounded-2xl p-6 animate-slide-up"
        style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{section.icon || '📄'}</span>
            <h3 className="text-lg font-bold text-white">{section.title}</h3>
          </div>
          {isRepeatable && (
            <button
              type="button"
              onClick={() => addEntry(section.sectionId)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              + Add Entry
            </button>
          )}
        </div>

        {section.description && (
          <p className="text-xs text-slate-500 mb-4">{section.description}</p>
        )}

        {isRepeatable ? (
          <div className="space-y-6">
            {entryCount === 0 && (
              <div className="text-center py-8 rounded-xl"
                style={{ background: 'rgba(99,102,241,0.05)', border: '1px dashed rgba(99,102,241,0.2)' }}>
                <p className="text-sm text-slate-500">No entries yet</p>
                <button type="button" onClick={() => addEntry(section.sectionId)}
                  className="mt-2 text-xs font-semibold cursor-pointer border-none px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                  + Add your first {section.title.toLowerCase()} entry
                </button>
              </div>
            )}
            {Array.isArray(entries) && entries.map((_, idx) => (
              <div key={idx} className="glass-light rounded-xl p-5 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                    Entry {idx + 1}
                  </span>
                  <button type="button" onClick={() => removeEntry(section.sectionId, idx)}
                    className="text-xs cursor-pointer border-none px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map(field => {
                    const isWide = field.type === 'textarea' || ['description', 'details', 'summary'].includes(field.name);
                    return (
                      <div key={field.name} className={isWide ? 'md:col-span-2' : ''}>
                        {renderField(section, field, idx)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map(field => {
              const isWide = field.type === 'textarea' || ['summary', 'description', 'skills'].includes(field.name);
              return (
                <div key={field.name} className={isWide ? 'md:col-span-2' : ''}>
                  {renderField(section, field)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {sections.map(renderSection)}
    </div>
  );
}
