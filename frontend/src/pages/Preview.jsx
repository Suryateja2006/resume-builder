import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResume, getTemplate, getResumeHTML, exportPDF } from '../api';
import toast from 'react-hot-toast';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await getResumeHTML(id);
        setHtml(res.data.data.html);
      } catch (err) {
        toast.error('Failed to load preview');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [id]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const res = await exportPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.error('PDF export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Generating preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="glass rounded-2xl p-4 mb-8 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
              ← Back
            </button>
            <span className="text-slate-600">|</span>
            <h2 className="text-sm font-bold text-white">PDF Preview</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/resume/${id}`)}
              className="btn-secondary text-xs py-2 px-3">
              ✏️ Edit
            </button>
            <button onClick={handleExportPDF} disabled={exporting} className="btn-primary text-xs py-2 px-4">
              {exporting ? (
                <><span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Exporting...</>
              ) : '📥 Download PDF'}
            </button>
          </div>
        </div>

        {/* A4 Preview */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="mx-auto rounded-lg overflow-hidden shadow-2xl"
            style={{
              width: '210mm',
              maxWidth: '100%',
              background: 'white',
              aspectRatio: '210 / 297',
            }}>
            <iframe
              srcDoc={html}
              title="Resume Preview"
              style={{ width: '100%', height: '100%', border: 'none', minHeight: '842px' }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: '#64748b' }}>
            This is exactly how your PDF will look when exported
          </p>
        </div>
      </div>
    </div>
  );
}
