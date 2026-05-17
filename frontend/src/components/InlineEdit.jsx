import { useState } from 'react';

export default function InlineEdit({ value, onSave, tag: Tag = 'span', className = '', style = {} }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');

  const handleBlur = () => {
    setEditing(false);
    if (text !== value) onSave(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(value || '');
      setEditing(false);
    }
  };

  if (editing) {
    const isLong = (value || '').length > 80;
    return isLong ? (
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={className}
        style={{
          ...style,
          width: '100%',
          minHeight: '60px',
          padding: '4px 6px',
          border: '2px solid #6366f1',
          borderRadius: '4px',
          background: 'rgba(99,102,241,0.05)',
          outline: 'none',
          font: 'inherit',
          resize: 'vertical',
        }}
      />
    ) : (
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={className}
        style={{
          ...style,
          width: '100%',
          padding: '2px 6px',
          border: '2px solid #6366f1',
          borderRadius: '4px',
          background: 'rgba(99,102,241,0.05)',
          outline: 'none',
          font: 'inherit',
        }}
      />
    );
  }

  return (
    <Tag
      className={`inline-editable ${className}`}
      style={style}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Click to edit...</span>}
    </Tag>
  );
}
