import { useState, useEffect } from 'react';
import { getTemplates } from '../api';
import TemplateCard from '../components/TemplateCard';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await getTemplates();
        setTemplates(res.data.data || []);
      } catch (err) {
        setError('Failed to load templates. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-3">Connection Error</h2>
          <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Template</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
            Select a professionally designed template to get started. Each template is fully customizable.
          </p>
        </div>

        {/* Grid */}
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {templates.map(template => (
              <TemplateCard key={template.templateId} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-xl font-bold text-white mb-2">No Templates Yet</h2>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              Run <code className="px-2 py-1 rounded bg-slate-800 text-indigo-400">npm run seed</code> in the backend to add templates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
