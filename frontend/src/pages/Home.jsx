import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getResumes } from '../api';

export default function Home() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await getResumes();
        setResumes(res.data.data || []);
      } catch (err) {
        // No resumes yet, that's fine
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl"
             style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute top-40 right-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium animate-slide-up"
               style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            ✨ AI-Powered Resume Builder
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up"
              style={{ animationDelay: '0.1s' }}>
            Build{' '}
            <span className="gradient-text">Stunning</span>
            <br />
            Resumes in Minutes
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up"
             style={{ color: '#94a3b8', animationDelay: '0.2s' }}>
            Choose from professional templates, fill in your details with smart forms,
            and let AI enhance your content. Export as PDF instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
               style={{ animationDelay: '0.3s' }}>
            <Link to="/templates" className="btn-primary text-base py-3.5 px-8 no-underline">
              🚀 Get Started Free
            </Link>
            <a href="#features" className="btn-secondary text-base py-3.5 px-8 no-underline">
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to <span className="gradient-text">Stand Out</span>
          </h2>
          <p className="text-center mb-16 text-lg" style={{ color: '#64748b' }}>
            Powerful features designed to make resume building effortless
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Professional Templates', desc: 'Choose from beautifully designed templates for every industry and role.' },
              { icon: '⚡', title: 'Dynamic Forms', desc: 'Smart forms auto-adapt to your chosen template. No hardcoded fields.' },
              { icon: '✨', title: 'AI Enhancement', desc: 'Let AI polish your sentences with stronger verbs and better clarity.' },
              { icon: '👁️', title: 'Live Preview', desc: 'See your resume update in real-time as you type. What you see is what you get.' },
              { icon: '✏️', title: 'Inline Editing', desc: 'Click any text on the preview to edit it directly. Lightning fast edits.' },
              { icon: '📥', title: 'PDF Export', desc: 'Download your resume as a perfectly formatted PDF, ready to send.' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 glow-hover transition-all duration-500 group"
                   style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Resumes */}
      {resumes.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">📄 Your Recent Resumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.slice(0, 6).map(resume => (
                <Link key={resume._id} to={`/resume/${resume._id}`}
                  className="glass rounded-xl p-5 no-underline glow-hover transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: resume.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                        color: resume.status === 'completed' ? '#22c55e' : '#eab308',
                      }}>
                      {resume.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    Last saved: {new Date(resume.lastSavedAt || resume.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 glow animate-pulse-glow">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Resume?</h2>
            <p className="text-base mb-8" style={{ color: '#94a3b8' }}>
              Pick a template and start building in under 60 seconds.
            </p>
            <Link to="/templates" className="btn-primary text-lg py-4 px-10 no-underline">
              Browse Templates →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
