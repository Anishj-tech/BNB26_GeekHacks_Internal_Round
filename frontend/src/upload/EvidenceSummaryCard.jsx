import { ArrowRight, CheckCircle2, Circle, AlertCircle, Layers } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Divider } from '../design-system/components/Divider';

export const EvidenceSummaryCard = ({
  videoFile,
  audioFile,
  transcriptText,
  onStartAnalysis,
}) => {
  const isVideoStaged = Boolean(videoFile);
  const isAudioStaged = Boolean(audioFile);
  const isTranscriptStaged = Boolean(transcriptText.trim());

  const stagedCount = [isVideoStaged, isAudioStaged, isTranscriptStaged].filter(Boolean).length;
  const isReady = isVideoStaged;

  return (
    <div className="tl-evidence-summary-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--tl-brand)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-text-primary)', margin: 0 }}>
            Investigation Summary
          </h3>
        </div>

        <Badge variant={isReady ? 'match' : 'neutral'} size="sm" dot pulse={isReady}>
          {stagedCount} / 3 SOURCES
        </Badge>
      </div>

      <p className="tl-body-sm" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
        Review your forensic evidence bundle before initializing the multi-modal fusion engine.
      </p>

      {/* Modality Status List */}
      <div className="tl-summary-list">
        {/* Video item */}
        <div className={`tl-summary-item ${isVideoStaged ? 'staged' : 'pending'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isVideoStaged ? (
              <CheckCircle2 size={15} color="var(--tl-match)" />
            ) : (
              <AlertCircle size={15} color="var(--tl-brand)" />
            )}
            <div>
              <span className="source-name">Video / Visual</span>
              <span className="source-note">
                {isVideoStaged ? videoFile.name : 'Required primary media'}
              </span>
            </div>
          </div>
          <Badge variant={isVideoStaged ? 'match' : 'brand'} size="sm">
            {isVideoStaged ? 'STAGED' : 'REQUIRED'}
          </Badge>
        </div>

        {/* Audio item */}
        <div className={`tl-summary-item ${isAudioStaged ? 'staged' : 'optional'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAudioStaged ? (
              <CheckCircle2 size={15} color="var(--tl-match)" />
            ) : (
              <Circle size={15} color="var(--tl-text-muted)" />
            )}
            <div>
              <span className="source-name">Audio / Voice</span>
              <span className="source-note">
                {isAudioStaged ? audioFile.name : 'Embedded video audio will be used'}
              </span>
            </div>
          </div>
          <Badge variant={isAudioStaged ? 'match' : 'neutral'} size="sm">
            {isAudioStaged ? 'EXTERNAL' : 'EMBEDDED'}
          </Badge>
        </div>

        {/* Transcript item */}
        <div className={`tl-summary-item ${isTranscriptStaged ? 'staged' : 'optional'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isTranscriptStaged ? (
              <CheckCircle2 size={15} color="var(--tl-match)" />
            ) : (
              <Circle size={15} color="var(--tl-text-muted)" />
            )}
            <div>
              <span className="source-name">Transcript / Text</span>
              <span className="source-note">
                {isTranscriptStaged ? `${transcriptText.trim().split(/\s+/).length} words supplied` : 'Whisper automatic transcription'}
              </span>
            </div>
          </div>
          <Badge variant={isTranscriptStaged ? 'match' : 'neutral'} size="sm">
            {isTranscriptStaged ? 'REFERENCE' : 'AUTO-EXTRACT'}
          </Badge>
        </div>
      </div>

      <Divider variant="hairline" style={{ margin: '18px 0' }} />

      {/* Conceptual Pipeline Preview */}
      <div className="tl-summary-pipeline-preview">
        <span className="tl-label-tech">PREPARED PIPELINE PATHWAY</span>
        <div className="tl-pipeline-wire">
          <div className="wire-node">
            <span className="dot active" />
            <span className="text">Intake</span>
          </div>
          <div className="wire-line" />
          <div className="wire-node">
            <span className={`dot ${isReady ? 'ready' : ''}`} />
            <span className="text">Dual-Signals</span>
          </div>
          <div className="wire-line" />
          <div className="wire-node">
            <span className="dot" />
            <span className="text">Fusion</span>
          </div>
          <div className="wire-line" />
          <div className="wire-node">
            <span className="dot" />
            <span className="text">Trust Score</span>
          </div>
        </div>
      </div>

      {/* Start Analysis CTA */}
      <div style={{ marginTop: '20px' }}>
        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          disabled={!isReady}
          onClick={onStartAnalysis}
          style={{ width: '100%' }}
        >
          {isReady ? 'Start Analysis' : 'Upload Video to Continue'}
        </Button>

        {!isReady && (
          <p className="tl-summary-disabled-note">
            A primary video file is required before starting the investigation.
          </p>
        )}
      </div>
    </div>
  );
};
