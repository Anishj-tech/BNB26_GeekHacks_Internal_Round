import { useState } from 'react';
import {
  Upload,
  Video,
  Mic,
  FileText,
  Lock,
  ArrowRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useRouter } from '../router';
import { TrustLayerShell } from '../components/shell/TrustLayerShell';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { AnalysisProcessingView } from '../components/forensic/AnalysisProcessingView';
import { investigationService } from '../services/investigationService';

export const InvestigationNewRoute = () => {
  const { navigate } = useRouter();

  // Intake State
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [transcriptText, setTranscriptText] = useState('');
  const [sampleLoaded, setSampleLoaded] = useState(null);

  // Pipeline execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetInvestigationId, setTargetInvestigationId] = useState(null);

  // Sample Presets for instantaneous testing
  const presets = [
    {
      id: 'P1',
      name: 'Executive Briefing (Tampered)',
      videoName: 'briefing_leak_h264.mp4',
      size: 24.8 * 1024 * 1024,
      audioName: 'audio_cloned_track.wav',
      transcript: 'The cabinet will announce emergency liquidity reserves tomorrow morning across all financial institutions.',
    },
    {
      id: 'P2',
      name: 'UN Security Council (Authentic)',
      videoName: 'un_briefing_hq.mp4',
      size: 41.2 * 1024 * 1024,
      audioName: null,
      transcript: 'Delegations must coordinate multilateral humanitarian corridors according to international protocols.',
    },
    {
      id: 'P3',
      name: 'Surveillance Feed (Degraded)',
      videoName: 'cam04_alleyway_night.mp4',
      size: 8.4 * 1024 * 1024,
      audioName: null,
      transcript: '',
    },
  ];

  const handleLoadPreset = (preset) => {
    setSampleLoaded(preset.name);
    setVideoFile({
      name: preset.videoName,
      size: preset.size,
      type: 'video/mp4',
    });
    if (preset.audioName) {
      setAudioFile({
        name: preset.audioName,
        size: 4.2 * 1024 * 1024,
        type: 'audio/wav',
      });
    } else {
      setAudioFile(null);
    }
    setTranscriptText(preset.transcript);
  };

  const handleStartAnalysis = async () => {
    if (!videoFile) return;

    setIsProcessing(true);

    try {
      const newInvestigation = await investigationService.createInvestigation({
        videoFile,
        audioFile,
        transcriptText,
      });

      setTargetInvestigationId(newInvestigation.id);
    } catch (err) {
      console.error('Failed to create investigation:', err);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <AnalysisProcessingView
        evidenceReference={{
          filename: videoFile?.name || 'uploaded_evidence.mp4',
          size: videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB` : '14.2 MB',
          type: videoFile?.type || 'video/mp4',
          hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        }}
        hasAudio={Boolean(audioFile)}
        hasTranscript={Boolean(transcriptText?.trim())}
        onComplete={() => {
          navigate(`/investigation/${targetInvestigationId || 'INV-2026-001'}`);
        }}
      />
    );
  }

  return (
    <TrustLayerShell
      title="New Investigation Setup"
      breadcrumbs={[
        { label: 'INVESTIGATIONS', path: '/investigations' },
        { label: 'NEW SETUP' },
      ]}
      maxWidth="1180px"
    >
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="brand" size="xs">
            EVIDENCE STAGING SUITE
          </Badge>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
            CHAIN OF CUSTODY INTAKE
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--tl-font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 400,
            color: 'var(--tl-ink)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 10px',
          }}
        >
          Stage Multi-Modal Evidence
        </h1>
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.9375rem',
            color: 'var(--tl-body)',
            maxWidth: '720px',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Upload media sources for cross-modal forensic scrutiny. TrustLayer correlates visual keyframes,
          acoustic frequencies, and speech transcripts to verify consistency and unmask generative tampering.
        </p>

        {/* QUICK PRESET SELECTION ROW */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px 18px',
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color="var(--tl-primary)" />
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
              Quick Presets:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                style={{
                  background: sampleLoaded === preset.name ? 'var(--tl-primary)' : 'var(--tl-canvas)',
                  color: sampleLoaded === preset.name ? '#ffffff' : 'var(--tl-ink)',
                  border: `1px solid ${sampleLoaded === preset.name ? 'var(--tl-primary)' : 'var(--tl-hairline)'}`,
                  borderRadius: 'var(--tl-radius-sm)',
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN INTAKE WORKSPACE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(280px, 0.75fr)',
          gap: '32px',
          alignItems: 'start',
        }}
        className="tl-intake-grid"
      >
        {/* LEFT COLUMN: EVIDENCE INPUTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. PRIMARY VIDEO INPUT */}
          <div
            style={{
              backgroundColor: 'var(--tl-canvas)',
              border: `1px solid ${videoFile ? 'var(--tl-primary)' : 'var(--tl-hairline)'}`,
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
              transition: 'border-color 140ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--tl-radius-xs)',
                    backgroundColor: 'var(--tl-surface-card)',
                    color: 'var(--tl-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Video size={16} />
                </div>
                <h3 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: 0 }}>
                  Primary Video Footage (Required)
                </h3>
              </div>
              <Badge variant="brand" size="xs">PRIMARY MODALITY</Badge>
            </div>

            {videoFile ? (
              <div
                style={{
                  backgroundColor: 'var(--tl-surface-card)',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-ink)', display: 'block' }}>
                    {videoFile.name}
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'var(--tl-muted)' }}>
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Container Verified
                  </span>
                </div>
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setSampleLoaded(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--tl-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                  }}
                  title="Remove video file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 20px',
                  border: '2px dashed var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-md)',
                  backgroundColor: 'var(--tl-surface-soft)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 140ms ease',
                }}
              >
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-matroska,video/webm"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setVideoFile(e.target.files[0]);
                      setSampleLoaded(null);
                    }
                  }}
                />
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--tl-canvas)',
                    color: 'var(--tl-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    boxShadow: 'var(--tl-shadow-sm)',
                  }}
                >
                  <Upload size={18} />
                </div>
                <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-ink)', marginBottom: '4px' }}>
                  Click to select video evidence or drop file here
                </span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                  Supports MP4, MOV, MKV, WEBM (H.264 / ProRes) up to 250MB
                </span>
              </label>
            )}
          </div>

          {/* 2. OPTIONAL AUDIO EVIDENCE */}
          <div
            style={{
              backgroundColor: 'var(--tl-canvas)',
              border: `1px solid ${audioFile ? 'var(--tl-accent-teal)' : 'var(--tl-hairline)'}`,
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--tl-radius-xs)',
                    backgroundColor: 'var(--tl-surface-card)',
                    color: 'var(--tl-accent-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mic size={16} />
                </div>
                <h3 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: 0 }}>
                  Isolated Audio Track (Optional)
                </h3>
              </div>
              <Badge variant="neutral" size="xs">CORROBORATING</Badge>
            </div>

            {audioFile ? (
              <div
                style={{
                  backgroundColor: 'var(--tl-surface-card)',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-ink)', display: 'block' }}>
                    {audioFile.name}
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'var(--tl-muted)' }}>
                    Separate microphone / broadcast feed
                  </span>
                </div>
                <button
                  onClick={() => setAudioFile(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--tl-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-md)',
                  backgroundColor: 'var(--tl-surface-soft)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  accept="audio/wav,audio/mp3,audio/aac,audio/m4a"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAudioFile(e.target.files[0]);
                    }
                  }}
                />
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--tl-ink)', display: 'block' }}>
                    Upload auxiliary master audio (WAV, MP3, AAC)
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)' }}>
                    If omitted, the embedded video audio track will be extracted automatically.
                  </span>
                </div>
                <Button variant="secondary" size="sm" type="button">
                  Browse Audio
                </Button>
              </label>
            )}
          </div>

          {/* 3. OPTIONAL TRANSCRIPT */}
          <div
            style={{
              backgroundColor: 'var(--tl-canvas)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--tl-radius-xs)',
                    backgroundColor: 'var(--tl-surface-card)',
                    color: 'var(--tl-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={16} />
                </div>
                <h3 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: 0 }}>
                  Reference Transcript Text (Optional)
                </h3>
              </div>
              <Badge variant="neutral" size="xs">PHONEMIC LOCK</Badge>
            </div>

            <textarea
              rows={4}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Paste official transcript or expected verbatim speech to correlate with acoustic phonemes..."
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--tl-surface-soft)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.875rem',
                color: 'var(--tl-ink)',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)', display: 'block', marginTop: '6px' }}>
              TrustLayer uses this to check for syllable insertion, audio splicing, and speech divergence.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: EVIDENCE SUMMARY & ANALYSIS TRIGGER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-primary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                EVIDENCE AUDIT PREVIEW
              </span>
              <Badge variant={videoFile ? 'match' : 'neutral'} size="xs">
                {videoFile ? 'READY FOR PIPELINE' : 'AWAITING VIDEO'}
              </Badge>
            </div>

            <h3
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: '1.375rem',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: '0 0 16px',
              }}
            >
              Intake Summary
            </h3>

            {/* Checklist of Modalities */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--tl-body)' }}>Video Keyframes:</span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontWeight: 600, color: videoFile ? 'var(--tl-success)' : 'var(--tl-muted)' }}>
                  {videoFile ? 'STAGED (100%)' : 'MISSING'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--tl-body)' }}>Audio Spectrogram:</span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontWeight: 600, color: audioFile || videoFile ? 'var(--tl-success)' : 'var(--tl-muted)' }}>
                  {audioFile ? 'AUX MASTER' : videoFile ? 'EMBEDDED STREAM' : 'MISSING'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--tl-body)' }}>Transcript Alignment:</span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontWeight: 600, color: transcriptText?.trim() ? 'var(--tl-success)' : 'var(--tl-muted)' }}>
                  {transcriptText?.trim() ? 'USER SUPPLIED' : 'AUTO-WHISPER'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--tl-body)' }}>Cross-Modal Lip-Sync:</span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontWeight: 600, color: videoFile ? 'var(--tl-accent-teal)' : 'var(--tl-muted)' }}>
                  {videoFile ? 'SYNCNET READY' : 'REQUIRES VIDEO'}
                </span>
              </div>
            </div>

            {/* Start Dissection Button */}
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleStartAnalysis}
              disabled={!videoFile}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              Run Forensic Dissection
            </Button>

            {!videoFile && (
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)', textAlign: 'center', display: 'block' }}>
                Select a video file or pick a Quick Preset above to continue.
              </span>
            )}
          </div>

          {/* CHAIN OF CUSTODY NOTICE */}
          <div
            style={{
              backgroundColor: 'var(--tl-canvas)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lock size={15} color="var(--tl-primary)" />
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                CRYPTOGRAPHIC INTEGRITY GUARANTEE
              </span>
            </div>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)', margin: 0, lineHeight: 1.5 }}>
              Each staged media modality is hashed using SHA-256 upon intake. Timestamps and frame offsets
              are cryptographically bound into an immutable chain of custody record.
            </p>
          </div>
        </div>
      </div>
    </TrustLayerShell>
  );
};
