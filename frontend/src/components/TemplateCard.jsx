import { useNavigate } from 'react-router-dom';

const colorMap = {
  modern: { from: '#6366f1', to: '#8b5cf6' },
  classic: { from: '#1e40af', to: '#3b82f6' },
  creative: { from: '#e11d48', to: '#f43f5e' },
  minimal: { from: '#0f766e', to: '#14b8a6' },
};

const iconMap = {
  modern: '⚡', classic: '🏛️', creative: '🎨', minimal: '✨',
};

export default function TemplateCard({ template }) {
  const navigate = useNavigate();
  const colors = colorMap[template.thumbnail] || colorMap.modern;
  const icon = iconMap[template.thumbnail] || '📄';

  return (
    <div
      className="glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 glow-hover group"
      onClick={() => navigate(`/builder/${template.templateId}`)}
      style={{ animationDelay: '0.1s' }}
    >
      {/* Preview area */}
      <div
        className="h-48 relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)` }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 right-4 h-3 rounded-full"
               style={{ background: `linear-gradient(to right, ${colors.from}, ${colors.to})` }}></div>
          <div className="absolute top-10 left-4 w-24 h-2 rounded bg-slate-600"></div>
          <div className="absolute top-10 right-4 w-16 h-2 rounded bg-slate-600"></div>
          <div className="absolute top-16 left-4 right-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-1.5 rounded bg-slate-700" style={{ width: `${85 - i * 10}%` }}></div>
            ))}
          </div>
          <div className="absolute bottom-8 left-4 right-4 flex gap-2 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 rounded px-3"
                   style={{ background: `${colors.from}30`, width: `${50 + i * 10}px` }}></div>
            ))}
          </div>
        </div>

        <div className="text-6xl z-10 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>

        {/* Layout badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
             style={{ background: `${colors.from}25`, color: colors.from, border: `1px solid ${colors.from}30` }}>
          {template.layout}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
          {template.name}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
          {template.description}
        </p>

        {/* Section count */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {template.sections.slice(0, 4).map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                {s.icon}
              </span>
            ))}
            {template.sections.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                +{template.sections.length - 4}
              </span>
            )}
          </div>
          <span className="text-xs font-medium" style={{ color: colors.from }}>
            {template.sections.length} sections →
          </span>
        </div>
      </div>
    </div>
  );
}
