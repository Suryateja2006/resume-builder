import { useState } from 'react';

export default function AddSectionModal({ onAdd, onClose, existingSections }) {
  const [title, setTitle] = useState('');
  const [repeatable, setRepeatable] = useState(false);
  const [icon, setIcon] = useState('📝');
  const [fields, setFields] = useState([{ name: '', label: '', type: 'text', placeholder: '' }]);

  const icons = ['📝', '🏆', '💡', '🌐', '📚', '🎯', '🔧', '💪', '🎤', '📊', '🤝', '⭐'];

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', placeholder: '' }]);
  };

  const removeField = (idx) => {
    if (fields.length > 1) setFields(fields.filter((_, i) => i !== idx));
  };

  const updateField = (idx, key, val) => {
    setFields(fields.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validFields = fields.filter(f => f.label.trim());
    if (validFields.length === 0) return;

    const sectionId = 'custom_' + title.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    const section = {
      sectionId,
      title: title.trim(),
      icon,
      repeatable,
      fields: validFields.map(f => ({
        ...f,
        name: f.name || f.label.toLowerCase().replace(/\s+/g, '_'),
      })),
    };

    onAdd(section);
  };

  return (
        <div className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
         onClick={onClose}>
      <div className="glass rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up"
           style={{ border: '1px solid rgba(99,102,241,0.2)' }}
           onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Custom Section</h2>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Icon picker */}
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Section Icon</label>
              <div className="flex flex-wrap gap-2">
                {icons.map(ic => (
                  <button key={ic} type="button" onClick={() => setIcon(ic)}
                    className="w-10 h-10 rounded-lg text-lg flex items-center justify-center cursor-pointer border transition-all"
                    style={{
                      background: icon === ic ? 'rgba(99,102,241,0.2)' : 'rgba(15,23,42,0.6)',
                      borderColor: icon === ic ? '#6366f1' : 'rgba(99,102,241,0.1)',
                    }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Section title */}
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Section Title</label>
              <input
                type="text" value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field"
                placeholder="e.g., Volunteering, Awards, Languages..."
                required
              />
            </div>

            {/* Repeatable toggle */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setRepeatable(!repeatable)}
                className="w-12 h-6 rounded-full relative cursor-pointer border-none transition-all"
                style={{ background: repeatable ? '#6366f1' : '#334155' }}>
                <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                     style={{ left: repeatable ? '26px' : '2px' }}></div>
              </button>
              <span className="text-sm text-slate-300">Allow multiple entries</span>
            </div>

            {/* Fields */}
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Fields</label>
              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text" value={field.label}
                        onChange={e => updateField(idx, 'label', e.target.value)}
                        className="input-field text-xs"
                        placeholder="Field label"
                      />
                      <select value={field.type}
                        onChange={e => updateField(idx, 'type', e.target.value)}
                        className="input-field text-xs cursor-pointer">
                        <option value="text">Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="email">Email</option>
                        <option value="url">URL</option>
                        <option value="tel">Phone</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => removeField(idx)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none text-xs flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addField}
                className="mt-3 text-xs font-semibold cursor-pointer border-none px-3 py-2 rounded-lg transition-all"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                + Add Field
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
              Add Section
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
