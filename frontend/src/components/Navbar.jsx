import { Link, useLocation } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

export default function Navbar() {
  const location = useLocation();
  const { isSaving, lastSaved } = useResume();

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/templates', label: 'Templates', icon: '📄' },
  ];

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
               style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            📝
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-300"
              style={{
                color: location.pathname === link.to ? '#818cf8' : '#94a3b8',
                background: location.pathname === link.to ? 'rgba(99,102,241,0.1)' : 'transparent',
              }}
            >
              <span className="mr-1.5">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-xs text-yellow-400 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
              Saving...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-xs flex items-center gap-1.5" style={{ color: '#10b981' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#10b981' }}></span>
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
