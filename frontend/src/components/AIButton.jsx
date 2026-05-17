import { useState } from 'react';
import { createPortal } from 'react-dom';
import { improveText } from '../api';
import toast from 'react-hot-toast';

export default function AIButton({ text, onAccept, context }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleImprove = async () => {
    if (!text || text.trim().length < 3) {
      toast.error('Enter some text first to improve');
      return;
    }

    setLoading(true);
    try {
      const res = await improveText(text, context);
      setSuggestion(res.data.data);
    } catch (err) {
      toast.error('AI improvement failed');
    } finally {
      setLoading(false);
    }
  };

  const accept = () => {
    if (suggestion) {
      onAccept(suggestion.improvedText);
      setSuggestion(null);
      toast.success('Text improved!');
    }
  };

  const reject = () => {
    setSuggestion(null);
    toast('Suggestion dismissed', { icon: '👋' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleImprove}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer border-none"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          color: 'white',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Improving...
          </>
        ) : (
          <>✨ Improve with AI</>
        )}
      </button>

      {/* Suggestion popup */}
      {suggestion && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 1200, pointerEvents: 'none' }}>
          <div className="absolute right-4 top-24 w-[360px] max-w-[90vw] animate-slide-up"
               style={{ pointerEvents: 'auto' }}>
            <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">✨</span>
                <span className="text-xs font-semibold text-purple-300">AI Suggestion</span>
                {suggestion.source === 'fallback' && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                    Basic
                  </span>
                )}
              </div>

              {/* Original */}
              <div className="mb-3">
                <span className="text-xs font-medium text-slate-500 block mb-1">Original:</span>
                <p className="text-xs leading-relaxed p-2 rounded-lg"
                   style={{ background: 'rgba(239,68,68,0.05)', color: '#f87171', border: '1px solid rgba(239,68,68,0.1)' }}>
                  {suggestion.original}
                </p>
              </div>

              {/* Improved */}
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-500 block mb-1">Improved:</span>
                <p className="text-xs leading-relaxed p-2 rounded-lg"
                   style={{ background: 'rgba(34,197,94,0.05)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.1)' }}>
                  {suggestion.improvedText}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={accept}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}>
                  ✓ Accept
                </button>
                <button onClick={reject}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
