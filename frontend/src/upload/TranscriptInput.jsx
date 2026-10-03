import { useRef } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { Badge } from '../design-system/components/Badge';

export const TranscriptInput = ({ transcriptText, onTranscriptChange, onTranscriptClear }) => {
  const fileInputRef = useRef(null);

  const wordCount = transcriptText.trim() ? transcriptText.trim().split(/\s+/).length : 0;
  const charCount = transcriptText.length;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onTranscriptChange(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="tl-secondary-evidence-box">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--tl-radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--tl-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tl-text-primary)',
            }}
          >
            <FileText size={14} />
          </div>
          <div>
            <span className="tl-label-tech" style={{ color: 'var(--tl-text-primary)' }}>
              TEXT / TRANSCRIPT EVIDENCE
            </span>
            <span style={{ color: 'var(--tl-text-muted)', fontSize: '0.6875rem', marginLeft: '6px' }}>
              (Optional)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".vtt,.srt,.txt,text/plain"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            className="tl-evidence-action-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Import .vtt / .srt / .txt file"
            aria-label="Import transcript file"
          >
            <Upload size={12} />
            <span>Import Subtitles</span>
          </button>

          <Badge variant={transcriptText.trim() ? 'match' : 'neutral'} size="sm">
            {transcriptText.trim() ? `${wordCount} WORDS` : 'OPTIONAL'}
          </Badge>
        </div>
      </div>

      <p className="tl-body-sm" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
        Provide reference captions or transcript for cross-modal phonetic lip alignment and speech consistency verification.
      </p>

      <div className="tl-transcript-editor-wrapper">
        <textarea
          className="tl-transcript-textarea"
          value={transcriptText}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste speech transcript, subtitles, or captions here..."
          rows={4}
        />

        <div className="tl-transcript-footer">
          <span className="tl-mono" style={{ fontSize: '0.6875rem', color: 'var(--tl-text-muted)' }}>
            {wordCount} words • {charCount} characters
          </span>

          {transcriptText.length > 0 && (
            <button className="tl-clear-text-btn" onClick={onTranscriptClear} aria-label="Clear transcript">
              <X size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
