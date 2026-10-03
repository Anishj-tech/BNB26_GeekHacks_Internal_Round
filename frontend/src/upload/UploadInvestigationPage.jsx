import { useState } from 'react';
import { Lock, FileSearch } from 'lucide-react';
import { UploadHeader } from './UploadHeader';
import { VideoDropzone } from './VideoDropzone';
import { AudioDropzone } from './AudioDropzone';
import { TranscriptInput } from './TranscriptInput';
import { EvidenceSummaryCard } from './EvidenceSummaryCard';
import { AnalysisReadyModal } from './AnalysisReadyModal';
import { Card, CardContent } from '../design-system/components/Card';
import { Badge } from '../design-system/components/Badge';

export const UploadInvestigationPage = ({ onBack }) => {
  // Investigation state
  const [investigationId] = useState(() => `INV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-01`);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [transcriptText, setTranscriptText] = useState('');
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const handleStartAnalysis = () => {
    setIsAnalysisModalOpen(true);
  };

  return (
    <div className="tl-app-layout tl-forensic-bg">
      <div className="tl-radial-vignette" />

      {/* Header with Step Indicator */}
      <UploadHeader onBack={onBack} investigationId={investigationId} />

      {/* Main Workspace */}
      <main className="tl-upload-main">
        {/* Title & Introduction */}
        <div className="tl-upload-title-area">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Badge variant="brand" size="sm" dot>
              STEP 01 // EVIDENCE INTAKE
            </Badge>
            <span className="tl-label-tech">MULTI-MODAL DISSECTION SUITE</span>
          </div>

          <h1 className="tl-upload-heading">Start an Investigation</h1>
          <p className="tl-upload-subheading">
            Supply media evidence for multi-modal authenticity verification. TrustLayer correlates visual frames, acoustic frequencies, and speech transcripts to detect synthetic manipulation and verify cross-modal consistency.
          </p>
        </div>

        {/* Two-Column Grid: Evidence Inputs (Left) & Summary (Right) */}
        <div className="tl-upload-grid">
          {/* Left Column: Evidence Inputs */}
          <div className="tl-upload-inputs-col">
            {/* 1. Primary Video Upload */}
            <VideoDropzone
              videoFile={videoFile}
              onVideoSelect={(file) => setVideoFile(file)}
              onVideoRemove={() => setVideoFile(null)}
            />

            {/* Subtle Divider */}
            <div className="tl-evidence-source-divider">
              <span className="divider-line" />
              <span className="divider-label">OPTIONAL CORROBORATING EVIDENCE</span>
              <span className="divider-line" />
            </div>

            {/* 2. Optional Audio Evidence */}
            <AudioDropzone
              audioFile={audioFile}
              onAudioSelect={(file) => setAudioFile(file)}
              onAudioRemove={() => setAudioFile(null)}
            />

            {/* 3. Optional Transcript Evidence */}
            <TranscriptInput
              transcriptText={transcriptText}
              onTranscriptChange={(text) => setTranscriptText(text)}
              onTranscriptClear={() => setTranscriptText('')}
            />
          </div>

          {/* Right Column: Evidence Summary & Analysis Initiation */}
          <div className="tl-upload-summary-col">
            <EvidenceSummaryCard
              videoFile={videoFile}
              audioFile={audioFile}
              transcriptText={transcriptText}
              onStartAnalysis={handleStartAnalysis}
            />

            {/* Chain of Custody & Privacy Notice */}
            <Card variant="surface" style={{ marginTop: '20px' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Lock size={14} color="var(--tl-text-muted)" />
                  <span className="tl-label-tech">CHAIN OF CUSTODY INTEGRITY</span>
                </div>
                <p className="tl-body-sm" style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                  Media files are evaluated locally during initial inspection. Cryptographic hashes are generated for each staged modality to maintain verifiable evidence provenance.
                </p>
              </CardContent>
            </Card>

            <Card variant="surface" style={{ marginTop: '14px' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileSearch size={14} color="var(--tl-brand)" />
                  <span className="tl-label-tech">MULTI-MODAL ENGINE NOTE</span>
                </div>
                <p className="tl-body-sm" style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                  If external audio or transcript files are not provided, TrustLayer will automatically extract speech and audio tracks directly from the primary video container.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Analysis Ready Transition Modal */}
      <AnalysisReadyModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        investigationId={investigationId}
        videoFile={videoFile}
        audioFile={audioFile}
        transcriptText={transcriptText}
      />
    </div>
  );
};
