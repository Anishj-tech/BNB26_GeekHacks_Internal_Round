import { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, UploadCloud, X, RefreshCw, Volume2 } from 'lucide-react';
import { Badge } from '../design-system/components/Badge';

export const AudioDropzone = ({ audioFile, onAudioSelect, onAudioRemove }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const audioUrl = useMemo(() => {
    if (!audioFile) return null;
    return URL.createObjectURL(audioFile);
  }, [audioFile]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const validateAndSelectFile = (file) => {
    setErrorMsg(null);
    if (!file) return;

    const validExtensions = ['wav', 'mp3', 'aac', 'm4a', 'flac', 'ogg'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!file.type.startsWith('audio/') && !validExtensions.includes(ext)) {
      setErrorMsg('Unsupported audio format. Please select a WAV, MP3, or AAC file.');
      return;
    }

    onAudioSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
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
              backgroundColor: 'var(--tl-match-subtle)',
              border: '1px solid var(--tl-match-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tl-match)',
            }}
          >
            <Mic size={14} />
          </div>
          <div>
            <span className="tl-label-tech" style={{ color: 'var(--tl-text-primary)' }}>
              AUDIO / VOICE EVIDENCE
            </span>
            <span style={{ color: 'var(--tl-text-muted)', fontSize: '0.6875rem', marginLeft: '6px' }}>
              (Optional)
            </span>
          </div>
        </div>

        <Badge variant={audioFile ? 'match' : 'neutral'} size="sm">
          {audioFile ? 'AUDIO STAGED' : 'OPTIONAL'}
        </Badge>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.wav,.mp3,.aac,.m4a,.flac"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndSelectFile(e.target.files[0]);
          }
        }}
      />

      {audioFile ? (
        <div className="tl-audio-staged-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <Volume2 size={18} color="var(--tl-match)" style={{ flexShrink: 0 }} />
              <div style={{ overflow: 'hidden' }}>
                <span className="tl-audio-filename" title={audioFile.name}>
                  {audioFile.name}
                </span>
                <span className="tl-meta" style={{ display: 'block' }}>
                  {formatFileSize(audioFile.size)} • {audioFile.type || 'audio/wav'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button
                className="tl-evidence-action-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Replace Audio"
                aria-label="Replace Audio"
              >
                <RefreshCw size={13} />
              </button>
              <button
                className="tl-evidence-action-btn danger"
                onClick={onAudioRemove}
                title="Remove Audio"
                aria-label="Remove Audio"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {audioUrl && (
            <div style={{ marginTop: '10px' }}>
              <audio src={audioUrl} controls className="tl-native-audio-player" />
            </div>
          )}
        </div>
      ) : (
        <div
          className={`tl-audio-dropzone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <UploadCloud size={18} color="var(--tl-text-muted)" />
          <span className="tl-body-sm" style={{ fontSize: '0.8125rem' }}>
            Drop external audio track or <strong style={{ color: 'var(--tl-brand)' }}>browse</strong>
          </span>
          <span className="tl-meta">WAV, MP3, AAC, FLAC</span>
        </div>
      )}

      {errorMsg && (
        <span style={{ fontSize: '0.6875rem', color: 'var(--tl-conflict)', marginTop: '4px', display: 'block' }}>
          {errorMsg}
        </span>
      )}
    </div>
  );
};
