import { useState, useRef, useEffect, useMemo } from 'react';
import { Video, UploadCloud, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '../design-system/components/Badge';

export const VideoDropzone = ({ videoFile, onVideoSelect, onVideoRemove }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const videoPreviewUrl = useMemo(() => {
    if (!videoFile) return null;
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleVideoMetadataLoaded = (e) => {
    const video = e.target;
    if (video) {
      setVideoMetadata({
        duration: video.duration ? `${Math.round(video.duration)}s` : null,
        dimensions: video.videoWidth && video.videoHeight ? `${video.videoWidth}×${video.videoHeight}` : null,
      });
    }
  };

  const validateAndSelectFile = (file) => {
    setErrorMsg(null);
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const extension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['mp4', 'webm', 'mov'];

    if (!validTypes.includes(file.type) && !validExtensions.includes(extension)) {
      setErrorMsg('Unsupported format. Please select an MP4, WebM, or MOV video.');
      return;
    }

    onVideoSelect(file);
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
    <div className="tl-video-upload-container">
      {/* Title & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--tl-radius-sm)',
              backgroundColor: 'var(--tl-brand-subtle)',
              border: '1px solid var(--tl-brand-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tl-brand)',
            }}
          >
            <Video size={15} />
          </div>
          <span className="tl-label-tech" style={{ color: 'var(--tl-text-primary)', fontSize: '0.8125rem' }}>
            PRIMARY EVIDENCE // VIDEO / VISUAL
          </span>
        </div>

        <Badge variant={videoFile ? 'match' : 'brand'} size="sm" dot>
          {videoFile ? 'EVIDENCE STAGED' : 'REQUIRED FOR MVP'}
        </Badge>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndSelectFile(e.target.files[0]);
          }
        }}
      />

      {/* Selected Video State */}
      {videoFile ? (
        <div className="tl-video-staged-card">
          <div className="tl-video-preview-wrapper">
            {videoPreviewUrl ? (
              <video
                src={videoPreviewUrl}
                className="tl-video-native-preview"
                controls
                muted
                onLoadedMetadata={handleVideoMetadataLoaded}
              />
            ) : (
              <div className="tl-video-preview-placeholder">
                <Video size={36} color="var(--tl-brand)" />
              </div>
            )}
          </div>

          <div className="tl-video-staged-info">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <span className="tl-label-tech" style={{ fontSize: '0.625rem' }}>
                  EVIDENCE FILE NAME
                </span>
                <h4 className="tl-video-filename" title={videoFile.name}>
                  {videoFile.name}
                </h4>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="tl-evidence-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Replace Video"
                  aria-label="Replace Video"
                >
                  <RefreshCw size={14} />
                  <span>Replace</span>
                </button>
                <button
                  className="tl-evidence-action-btn danger"
                  onClick={onVideoRemove}
                  title="Remove Video"
                  aria-label="Remove Video"
                >
                  <X size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Staging status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'var(--tl-match-subtle)', borderRadius: 'var(--tl-radius-sm)', border: '1px solid var(--tl-match-border)', margin: '4px 0' }}>
              <CheckCircle2 size={13} color="var(--tl-match)" />
              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-match)' }}>
                EVIDENCE ARTIFACT VERIFIED & STAGED
              </span>
            </div>

            {/* Available browser metadata badges */}
            <div className="tl-video-meta-tags">
              <span className="tl-meta-tag">
                SIZE: <strong>{formatFileSize(videoFile.size)}</strong>
              </span>
              <span className="tl-meta-tag">
                TYPE: <strong>{videoFile.type || 'video/mp4'}</strong>
              </span>
              {videoMetadata?.dimensions && (
                <span className="tl-meta-tag">
                  RES: <strong>{videoMetadata.dimensions}</strong>
                </span>
              )}
              {videoMetadata?.duration && (
                <span className="tl-meta-tag">
                  LEN: <strong>{videoMetadata.duration}</strong>
                </span>
              )}
            </div>

            <div className="tl-video-staged-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="var(--tl-match)" />
                <span style={{ fontSize: '0.6875rem', color: 'var(--tl-text-secondary)', fontFamily: 'var(--tl-font-mono)' }}>
                  VIDEO ARTIFACT READY FOR MULTI-MODAL DISSECTION
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Drag & Drop Surface */
        <div
          className={`tl-video-dropzone ${isDragOver ? 'drag-over' : ''}`}
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
          {/* Subtle Scanning Hairline Motif */}
          <div className="tl-dropzone-scanline" />

          <div className="tl-dropzone-content">
            <div className="tl-dropzone-icon-box">
              <UploadCloud size={28} />
            </div>

            <h3 className="tl-dropzone-title">
              Drop your video evidence here
            </h3>
            <p className="tl-dropzone-sub">
              or <span className="highlight">choose a video from your device</span>
            </p>

            <div className="tl-dropzone-formats">
              <span className="format-tag">MP4</span>
              <span className="format-tag">WEBM</span>
              <span className="format-tag">MOV</span>
              <span style={{ color: 'var(--tl-border)' }}>•</span>
              <span className="spec-note">High-resolution frame extraction</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="tl-evidence-error">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
