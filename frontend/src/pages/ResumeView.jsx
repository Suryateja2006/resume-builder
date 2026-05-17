import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResume, getTemplate, updateResume as updateResumeAPI, deleteResume as deleteResumeAPI, exportPDF } from '../api';
import { useResume } from '../context/ResumeContext';
import ResumePreview from '../components/ResumePreview';
import toast from 'react-hot-toast';

export default function ResumeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTemplate, setResumeId, setResumeData, setCustomSections, template } = useResume();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await getResume(id);
        const resume = res.data.data;
        setResumeId(resume._id);
        setResumeData(resume.data || {});
        setCustomSections(resume.customSections || []);

        const templateRes = await getTemplate(resume.templateId);
        setTemplate(templateRes.data.data);
      } catch (err) {
        toast.error('Failed to load resume');
        navigate('/templates');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
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
      toast.error('PDF export failed. Make sure Puppeteer is installed.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await deleteResumeAPI(id);
      toast.success('Resume deleted');
      navigate('/templates');
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Actions bar */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
              ← Back
            </button>
            <span className="text-slate-600">|</span>
            <h2 className="text-sm font-bold text-white">Resume Editor</h2>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
              Inline Edit Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            {template && (
              <Link to={`/builder/${template.templateId}`}
                className="btn-secondary text-xs py-2 px-3 no-underline">
                ✏️ Edit Form
              </Link>
            )}
            <Link to={`/preview/${id}`} className="btn-secondary text-xs py-2 px-3 no-underline">
              👁️ Full Preview
            </Link>
            <button onClick={handleExportPDF} disabled={exporting}
              className="btn-primary text-xs py-2 px-4">
              {exporting ? (
                <><span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Exporting...</>
              ) : '📥 Export PDF'}
            </button>
            <button onClick={handleDelete}
              className="text-xs py-2 px-3 rounded-xl cursor-pointer font-semibold border-none transition-all"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              🗑️
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-6">
          <p className="text-xs" style={{ color: '#64748b' }}>
            💡 Click on any text in the resume below to edit it directly
          </p>
        </div>

        {/* Preview with inline editing */}
        <div className="animate-slide-up rounded-2xl overflow-hidden shadow-2xl" style={{ animationDelay: '0.1s' }}>
          <ResumePreview template={template} />
        </div>
      </div>
    </div>
  );
}
