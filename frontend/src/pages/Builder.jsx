import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplate, createResume, updateResume as updateResumeAPI } from '../api';
import { useResume } from '../context/ResumeContext';
import DynamicForm from '../components/DynamicForm';
import ResumePreview from '../components/ResumePreview';
import AddSectionModal from '../components/AddSectionModal';
import toast from 'react-hot-toast';

export default function Builder() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const {
    template, setTemplate,
    resumeId, setResumeId,
    resumeData, setResumeData,
    customSections, addCustomSection, removeCustomSection, updateCustomField,
    setCustomSections,
  } = useResume();

  const [loading, setLoading] = useState(true);
  const [showAddSection, setShowAddSection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getTemplate(templateId);
        setTemplate(res.data.data);

        if (!resumeId || template?.templateId !== templateId) {
          setResumeData({});
          setCustomSections([]);
          const createRes = await createResume({ templateId, data: {} });
          setResumeId(createRes.data.data._id);
        }
      } catch (err) {
        toast.error('Failed to load template');
        navigate('/templates');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [templateId]);

  const handleSave = async () => {
    if (!resumeId) return;
    setSaving(true);
    try {
      await updateResumeAPI(resumeId, {
        data: resumeData,
        customSections,
        title: resumeData.personalInfo?.fullName
          ? `${resumeData.personalInfo.fullName}'s Resume`
          : template?.name + ' Resume'
      });
      toast.success('Resume saved successfully!');
    } catch (err) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleCustomSectionAdd = (section) => {
    addCustomSection(section);
    setShowAddSection(false);
    toast.success(`"${section.title}" section added!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Setting up your builder...</p>
        </div>
      </div>
    );
  }

  if (!template) return null;

  const allSections = [...template.sections];

  return (
    <div className="min-h-screen">
      {/* Toolbar */}
      <div className="glass sticky top-14 z-40" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/templates')}
              className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
              ← Templates
            </button>
            <span className="text-slate-600">|</span>
            <h2 className="text-sm font-bold text-white">{template.name}</h2>
          </div>

          {/* Mobile tabs */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setActiveTab('form')}
              className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border-none font-medium"
              style={{
                background: activeTab === 'form' ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: activeTab === 'form' ? '#818cf8' : '#94a3b8',
              }}>
              📝 Form
            </button>
            <button onClick={() => setActiveTab('preview')}
              className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border-none font-medium"
              style={{
                background: activeTab === 'preview' ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: activeTab === 'preview' ? '#818cf8' : '#94a3b8',
              }}>
              👁️ Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddSection(true)} className="btn-secondary text-xs py-2 px-3">
              + Section
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4">
              {saving ? 'Saving...' : '💾 Save'}
            </button>
            {resumeId && (
              <button onClick={() => navigate(`/resume/${resumeId}`)}
                className="btn-secondary text-xs py-2 px-3">
                View →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content - split pane */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Form panel */}
          <div className={`w-full lg:w-1/2 flex-shrink-0 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
            <DynamicForm sections={allSections} />

            {/* Custom sections forms */}
            {customSections.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Custom Sections</h3>
                {customSections.map(cs => (
                  <div key={cs.sectionId} className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{cs.icon}</span>
                        <h3 className="text-lg font-bold text-white">{cs.title}</h3>
                      </div>
                      <button onClick={() => removeCustomSection(cs.sectionId)}
                        className="text-xs cursor-pointer border-none px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cs.fields.map(field => {
                        const val = cs.data?.[field.name] || '';
                        return (
                          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <label className="text-sm font-medium text-slate-300 block mb-2">{field.label}</label>
                            {field.type === 'textarea' ? (
                              <textarea
                                value={val}
                                onChange={e => updateCustomField(cs.sectionId, field.name, e.target.value)}
                                className="input-field resize-none"
                                rows={3}
                                placeholder={field.placeholder}
                              />
                            ) : (
                              <input
                                type={field.type || 'text'}
                                value={val}
                                onChange={e => updateCustomField(cs.sectionId, field.name, e.target.value)}
                                className="input-field"
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview panel */}
          <div className={`w-full lg:w-1/2 flex-shrink-0 ${activeTab === 'form' ? 'hidden lg:block' : ''}`}>
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Live Preview
                </h3>
                <span className="text-xs text-slate-600">Click any text to edit inline</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                <ResumePreview template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddSection && (
        <AddSectionModal
          onAdd={handleCustomSectionAdd}
          onClose={() => setShowAddSection(false)}
          existingSections={[...template.sections, ...customSections]}
        />
      )}
    </div>
  );
}
