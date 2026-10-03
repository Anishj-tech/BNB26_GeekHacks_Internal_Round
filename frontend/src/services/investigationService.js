/**
 * TrustLayer Investigation Service & Data Layer
 * 
 * Strict Forensic Separation:
 * - Evidence vs Synthetic Signals vs Consistency Signals
 * - Primary Evidence vs Supporting Evidence (Face Consistency is Supporting)
 * - Calibrated Trust Assessment (NOT a probability)
 * - Clean Service isolation with mock/demo fallback
 */

/**
 * @typedef {'TRUSTED' | 'PROBABLY TRUSTED' | 'UNCERTAIN' | 'PROBABLY MANIPULATED' | 'MANIPULATED'} TrustAssessmentType
 * @typedef {'VIDEO' | 'AUDIO' | 'TRANSCRIPT' | 'CROSS_MODAL' | 'FACE'} ModalityType
 */

// In-memory investigations database (isolated mock layer with realistic forensic cases)
let investigationsStore = [
  {
    id: 'INV-2026-001',
    name: 'Executive Cabinet Briefing Discrepancy',
    filename: 'briefing_leak_h264.mp4',
    fileSize: '24.8 MB',
    fileType: 'video/mp4',
    duration: '00:18',
    resolution: '1920x1080',
    fps: 30,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    createdAt: '2026-10-02T16:45:00Z',
    status: 'COMPLETED',
    isDemo: true,

    // Primary Trust Assessment
    assessment: {
      verdict: 'MANIPULATED',
      summary: 'Evidence indicates generative neural speech synthesis coupled with deepfake face swap manipulation. Critical cross-modal conflict detected between acoustic spectrogram and visual mouth articulation.',
      confidenceExplanation: 'High signal quality with 100% video and audio coverage confirms synthetic tampering. Face boundary artifacts and SyncNet desync corroborate generative alteration.',
      engineeringTrustIndex: 14, // 0-100 engineering index (clearly labeled, NOT probability)
      syntheticScore: 0.86,      // 0.0 - 1.0 (High)
      syntheticLabel: 'HIGH SYNTHETIC EVIDENCE',
      consistencyScore: 0.22,    // 0.0 - 1.0 (Low agreement)
      consistencyLabel: 'CRITICAL CONFLICT',
      evidenceCoverage: 92,      // percentage
      conflictDetected: true,
      insufficientEvidence: false,
    },

    // Two-Axis coordinates for visualization
    twoAxis: {
      synthetic: 0.86,
      consistency: 0.22,
      quadrant: 'AI MANIPULATION (HIGH SYNTHETIC / LOW CONSISTENCY)',
    },

    // Evidence Coverage Breakdown
    coverage: [
      { modality: 'VIDEO', label: 'Video Frames', analyzed: true, isSupporting: false, coverage: 100, detail: '540 frames analyzed for generative diffusion traces' },
      { modality: 'AUDIO', label: 'Audio Spectrum', analyzed: true, isSupporting: false, coverage: 100, detail: '16kHz spectrogram & neural vocoder check' },
      { modality: 'TRANSCRIPT', label: 'Speech Transcript', analyzed: true, isSupporting: false, coverage: 95, detail: 'Whisper-v3 phoneme alignment with timestamps' },
      { modality: 'CROSS_MODAL', label: 'Lip-Sync Correlation', analyzed: true, isSupporting: false, coverage: 90, detail: 'SyncNet 3D mouth velocity cross-referenced with audio' },
      { modality: 'FACE', label: 'Face Consistency', analyzed: true, isSupporting: true, coverage: 75, detail: 'Biological micro-blink & landmark tracking (Supporting Evidence)' },
    ],

    // Conflict Analysis Panel
    conflict: {
      detected: true,
      title: 'Critical Cross-Modal Conflict Identified',
      severity: 'HIGH',
      description: 'The visual articulation of consonants diverges sharply from the acoustic formant frequencies in audio frames 112 through 245.',
      details: [
        {
          pair: 'Audio Formants ⟷ Mouth Visemes',
          status: 'DESYNCHRONIZED',
          explanation: 'Bilabial consonants (/b/, /p/, /m/) appear in audio envelope 140ms prior to corresponding lip closures in video.',
        },
        {
          pair: 'Corneal Reflections ⟷ Background Environment',
          status: 'INCONSISTENT',
          explanation: 'Eye surface reflections indicate a 4-point rectangular studio light array, while background scene contains only warm overhead ceiling lights.',
        },
      ],
      impactOnTrust: 'Cross-modal disagreement significantly reduces trust confidence, indicating independent synthesis of audio and visual streams.',
    },

    // Video Forensics
    videoAnalysis: {
      framesAnalyzed: 540,
      visualSyntheticScore: 0.82,
      visualUncertainty: 'LOW (High Confidence in Signal)',
      suspiciousIntervals: [
        { start: '00:00', end: '00:04.2', status: 'NORMAL', label: 'Pristine Anchor' },
        { start: '00:04.2', end: '00:11.8', status: 'SUSPICIOUS', label: 'Warping & Lip Desync' },
        { start: '00:11.8', end: '00:18.0', status: 'NORMAL', label: 'Pristine Outro' },
      ],
      representativeFrames: [
        {
          frameNumber: 134,
          timestamp: '00:04.46',
          label: 'Jawline Boundary Blur',
          finding: 'Temporal blurring and pixel blending artifacts detected along jaw perimeter during head rotation.',
          confidence: 'High',
        },
        {
          frameNumber: 210,
          timestamp: '00:07.00',
          label: 'Corneal Specular Reflection',
          finding: 'Specular corneal light highlights fail to correlate with physical scene lighting geometry.',
          confidence: 'High',
        },
        {
          frameNumber: 288,
          timestamp: '00:09.60',
          label: 'Mouth Viseme Anomaly',
          finding: 'Mouth opens for vowel sound while audio waveform exhibits silent pause.',
          confidence: 'Very High',
        },
      ],
    },

    // Cross-Modal Consistency Relationships
    consistencyNetwork: [
      { source: 'Video Face', target: 'Audio Track', relationship: 'SyncNet Lip-Voice Timing', score: 0.24, status: 'CONFLICT', note: 'Acoustic onset precedes visual aperture by 140ms.' },
      { source: 'Acoustic Reverb', target: 'Room Geometry', relationship: 'RT60 Reverberation Match', score: 0.88, status: 'AGREEMENT', note: 'Room impulse response matches 40m² conference room.' },
      { source: 'Transcript', target: 'Audio Phonemes', relationship: 'Whisper Alignment', score: 0.96, status: 'AGREEMENT', note: 'Speech-to-text words map continuously to spoken audio.' },
      { source: 'Corneal Highlight', target: 'Scene Lighting', relationship: 'Light Field Coherence', score: 0.18, status: 'CONFLICT', note: 'Directional lighting vector contradicts visible room lamps.' },
    ],

    // Evidence Items (Primary vs Supporting)
    evidenceList: [
      {
        id: 'EV-01',
        modality: 'VIDEO',
        isSupporting: false,
        signalType: 'Diffusion Boundary Warping',
        score: 0.84,
        direction: 'SUSPICIOUS_ARTIFACT',
        uncertainty: 'Low',
        timeRange: '00:04.2 - 00:11.8',
        observation: 'Neural interpolation artifact detected around facial boundary contours in frames 126–354.',
        reasoning: 'Laplacian edge variance shows unnatural frequency dropoff characteristic of face-swap blending masks.',
      },
      {
        id: 'EV-02',
        modality: 'AUDIO',
        isSupporting: false,
        signalType: 'Synthetic Vocoder Harmonics',
        score: 0.79,
        direction: 'SUSPICIOUS_ARTIFACT',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:18.0',
        observation: 'High-frequency spectral gap above 7.8kHz typical of neural voice cloning algorithms.',
        reasoning: 'Bispectral acoustic analysis reveals phase discontinuities consistent with multi-band speech synthesis.',
      },
      {
        id: 'EV-03',
        modality: 'CROSS_MODAL',
        isSupporting: false,
        signalType: 'SyncNet Phoneme-Viseme Correlation',
        score: 0.22,
        direction: 'CROSS_MODAL_CONFLICT',
        uncertainty: 'Low',
        timeRange: '00:04.2 - 00:11.8',
        observation: 'Severe desynchronization between speech envelope velocity and 3D mouth landmarks.',
        reasoning: 'Normalized cross-correlation peaks at -140ms offset, far exceeding natural physiological thresholds (±25ms).',
      },
      {
        id: 'EV-04',
        modality: 'TRANSCRIPT',
        isSupporting: false,
        signalType: 'Phonetic Alignment',
        score: 0.94,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:18.0',
        observation: 'Whisper-v3 extracted transcript agrees with audio phoneme progression without unexpected word drops.',
        reasoning: 'Transcript reflects spoken words accurately, confirming the tampering is audiovisual rather than textual splicing.',
      },
      {
        id: 'EV-05',
        modality: 'FACE',
        isSupporting: true, // Supporting evidence flag!
        signalType: 'Blink Interval Cadence (Supporting)',
        score: 0.35,
        direction: 'SUSPICIOUS_ARTIFACT',
        uncertainty: 'Medium',
        timeRange: '00:00 - 00:18.0',
        observation: 'Spontaneous blink rate is suppressed below 4 blinks/minute across 18 seconds of speech.',
        reasoning: 'NOTE: Biological blink cadences serve as supporting correlation, not standalone proof. Occlusion occurs at frame 340.',
      },
    ],

    // Timeline Events
    timeline: [
      { step: 'Evidence Intake', timestamp: '16:45:01', status: 'COMPLETED', detail: 'Received MP4 media container. Computed SHA-256 seal.' },
      { step: 'Container Validation', timestamp: '16:45:03', status: 'COMPLETED', detail: 'H.264 stream valid. AAC audio stream present at 48kHz.' },
      { step: 'Frame Sampling', timestamp: '16:45:07', status: 'COMPLETED', detail: 'Extracted 540 sequential frames at 30fps.' },
      { step: 'Visual Artifact Analysis', timestamp: '16:45:14', status: 'COMPLETED', detail: 'Facial boundary blur and corneal reflections scanned.' },
      { step: 'Audio Forensic Dissection', timestamp: '16:45:20', status: 'COMPLETED', detail: 'Mel-spectrogram and vocoder phase harmonics analyzed.' },
      { step: 'Whisper Speech Transcription', timestamp: '16:45:25', status: 'COMPLETED', detail: 'Generated timestamped phonetic transcript.' },
      { step: 'Cross-Modal Consistency Check', timestamp: '16:45:31', status: 'COMPLETED', detail: 'SyncNet correlation flagged -140ms desynchronization.' },
      { step: 'Evidence Fusion Engine', timestamp: '16:45:36', status: 'COMPLETED', detail: 'Cross-modal conflict penalizes trust score.' },
      { step: 'Trust Assessment Finalized', timestamp: '16:45:39', status: 'COMPLETED', detail: 'Assessment: MANIPULATED with high confidence.' },
    ],
  },
  {
    id: 'INV-2026-002',
    name: 'Official UN Security Council Address',
    filename: 'un_security_briefing_hq.mp4',
    fileSize: '41.2 MB',
    fileType: 'video/mp4',
    duration: '00:26',
    resolution: '1920x1080',
    fps: 30,
    sha256: '3a5f82b7c4d1192e428bc459432104e1bc2a98f7e21a48c9027814b7e9a8f230',
    createdAt: '2026-10-02T14:10:00Z',
    status: 'COMPLETED',
    isDemo: true,

    assessment: {
      verdict: 'TRUSTED',
      summary: 'All independent forensic modalities demonstrate coherent agreement. SyncNet lip velocities match speech phonemes within natural biological thresholds (±8ms). No generative artifacts detected.',
      confidenceExplanation: '100% evidence coverage across video, audio, transcript, lip-sync, and facial landmarks with high signal-to-noise ratio.',
      engineeringTrustIndex: 94,
      syntheticScore: 0.08,
      syntheticLabel: 'LOW SYNTHETIC EVIDENCE',
      consistencyScore: 0.95,
      consistencyLabel: 'HIGH CONSISTENCY',
      evidenceCoverage: 98,
      conflictDetected: false,
      insufficientEvidence: false,
    },

    twoAxis: {
      synthetic: 0.08,
      consistency: 0.95,
      quadrant: 'AUTHENTIC BASELINE (LOW SYNTHETIC / HIGH CONSISTENCY)',
    },

    coverage: [
      { modality: 'VIDEO', label: 'Video Frames', analyzed: true, isSupporting: false, coverage: 100, detail: '780 frames verified for biological micro-motion' },
      { modality: 'AUDIO', label: 'Audio Spectrum', analyzed: true, isSupporting: false, coverage: 100, detail: 'Natural room impulse and acoustic resonances' },
      { modality: 'TRANSCRIPT', label: 'Speech Transcript', analyzed: true, isSupporting: false, coverage: 98, detail: 'Full transcript aligned to speech cadence' },
      { modality: 'CROSS_MODAL', label: 'Lip-Sync Correlation', analyzed: true, isSupporting: false, coverage: 95, detail: 'SyncNet confirms ±8ms phoneme-viseme lock' },
      { modality: 'FACE', label: 'Face Consistency', analyzed: true, isSupporting: true, coverage: 92, detail: 'Natural blink rate and vascular pulse (Supporting Evidence)' },
    ],

    conflict: {
      detected: false,
      title: 'No Conflict Detected',
      severity: 'NONE',
      description: 'All modalities corroborate an authentic recording with high coherence across physical and temporal vectors.',
      details: [],
      impactOnTrust: 'Mutual corroboration across all sensors increases confidence in authentic status.',
    },

    videoAnalysis: {
      framesAnalyzed: 780,
      visualSyntheticScore: 0.06,
      visualUncertainty: 'LOW (High Confidence)',
      suspiciousIntervals: [
        { start: '00:00', end: '00:26.0', status: 'NORMAL', label: 'Consistent Authentic Stream' },
      ],
      representativeFrames: [
        {
          frameNumber: 180,
          timestamp: '00:06.00',
          label: 'Specular Corneal Coherence',
          finding: 'Corneal specular highlights conform accurately to UN press room ceiling luminaire array.',
          confidence: 'High',
        },
        {
          frameNumber: 420,
          timestamp: '00:14.00',
          label: 'Natural Micro-Saccades',
          finding: 'Physiological eye saccades and eyelid micro-tremors conform to natural biological parameters.',
          confidence: 'High',
        },
      ],
    },

    consistencyNetwork: [
      { source: 'Video Face', target: 'Audio Track', relationship: 'SyncNet Lip-Voice Timing', score: 0.95, status: 'AGREEMENT', note: 'Phoneme envelope synchronized within ±8ms.' },
      { source: 'Acoustic Reverb', target: 'Room Geometry', relationship: 'Impulse Decay Matching', score: 0.92, status: 'AGREEMENT', note: 'Decay envelope agrees with large tiered assembly hall.' },
      { source: 'Transcript', target: 'Audio Track', relationship: 'Speech-to-Text Mapping', score: 0.98, status: 'AGREEMENT', note: 'Perfect alignment without spliced syllables.' },
    ],

    evidenceList: [
      {
        id: 'EV-10',
        modality: 'VIDEO',
        isSupporting: false,
        signalType: 'Biological Texture Continuity',
        score: 0.07,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:26.0',
        observation: 'Continuous skin pore structure and vascular flush visible without blur interpolation.',
        reasoning: 'Texture coherence persists across camera pans and rapid head turns.',
      },
      {
        id: 'EV-11',
        modality: 'AUDIO',
        isSupporting: false,
        signalType: 'Microphone Acoustic Space',
        score: 0.09,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:26.0',
        observation: 'Uniform acoustic floor with natural room reflections and speech formants.',
        reasoning: 'Bispectral testing confirms continuous harmonic phases without vocoder synthesis.',
      },
      {
        id: 'EV-12',
        modality: 'CROSS_MODAL',
        isSupporting: false,
        signalType: 'SyncNet Phoneme-Viseme Lock',
        score: 0.95,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:26.0',
        observation: 'Mouth contours track spoken vowels and labial consonants with sub-frame precision.',
        reasoning: 'Timing offset remains bounded within [-6ms, +10ms].',
      },
      {
        id: 'EV-13',
        modality: 'FACE',
        isSupporting: true,
        signalType: 'Blink Rate & Saccades (Supporting)',
        score: 0.91,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:26.0',
        observation: 'Natural 14 blinks/minute cadence with physiological velocity curves.',
        reasoning: 'Supporting verification corroborates biological origin.',
      },
    ],

    timeline: [
      { step: 'Evidence Intake', timestamp: '14:10:01', status: 'COMPLETED', detail: 'Received media file. Generated SHA-256 seal.' },
      { step: 'Validation', timestamp: '14:10:04', status: 'COMPLETED', detail: 'Media container clean.' },
      { step: 'Frame Sampling', timestamp: '14:10:09', status: 'COMPLETED', detail: '780 frames sampled.' },
      { step: 'Visual Analysis', timestamp: '14:10:16', status: 'COMPLETED', detail: 'No generative diffusion signatures.' },
      { step: 'Audio Analysis', timestamp: '14:10:22', status: 'COMPLETED', detail: 'Natural harmonics verified.' },
      { step: 'Cross-Modal Analysis', timestamp: '14:10:28', status: 'COMPLETED', detail: 'SyncNet verified tight lock.' },
      { step: 'Trust Assessment', timestamp: '14:10:33', status: 'COMPLETED', detail: 'Assessment: TRUSTED.' },
    ],
  },
  {
    id: 'INV-2026-003',
    name: 'Nighttime Alley Surveillance Feed',
    filename: 'cam04_alleyway_night.mp4',
    fileSize: '8.4 MB',
    fileType: 'video/mp4',
    duration: '00:12',
    resolution: '1280x720',
    fps: 15,
    sha256: 'e1d2c3b4a5968778a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef01234567',
    createdAt: '2026-10-01T22:30:00Z',
    status: 'COMPLETED',
    isDemo: true,

    assessment: {
      verdict: 'UNCERTAIN',
      summary: 'INSUFFICIENT EVIDENCE: Low resolution (720p@15fps), severe underexposure, and heavy acoustic reverberation obstruct conclusive authenticity assessment. Missing transcript modality.',
      confidenceExplanation: 'TrustLayer refuses to fabricate confidence when evidence is insufficient. Modality coverage is incomplete and facial landmarks are partially occluded.',
      engineeringTrustIndex: 48,
      syntheticScore: 0.38,
      syntheticLabel: 'AMBIGUOUS SIGNAL',
      consistencyScore: 0.44,
      consistencyLabel: 'UNCERTAIN AGREEMENT',
      evidenceCoverage: 46,
      conflictDetected: false,
      insufficientEvidence: true,
    },

    twoAxis: {
      synthetic: 0.38,
      consistency: 0.44,
      quadrant: 'UNCERTAIN ZONE (LOW COVERAGE / AMBIGUOUS SIGNALS)',
    },

    coverage: [
      { modality: 'VIDEO', label: 'Video Frames', analyzed: true, isSupporting: false, coverage: 60, detail: '180 low-light frames; partial facial occlusion' },
      { modality: 'AUDIO', label: 'Audio Spectrum', analyzed: true, isSupporting: false, coverage: 55, detail: 'High street noise and heavy wind rumble' },
      { modality: 'TRANSCRIPT', label: 'Speech Transcript', analyzed: false, isSupporting: false, coverage: 0, detail: 'Missing: Speech unintelligible due to SNR < 4dB' },
      { modality: 'CROSS_MODAL', label: 'Lip-Sync Correlation', analyzed: false, isSupporting: false, coverage: 0, detail: 'Mouth region occluded in shadows' },
      { modality: 'FACE', label: 'Face Consistency', analyzed: true, isSupporting: true, coverage: 35, detail: 'Sparse landmark tracking (Supporting Evidence)' },
    ],

    conflict: {
      detected: false,
      title: 'Signal Ambiguity & Missing Evidence',
      severity: 'MODERATE',
      description: 'No explicit cross-modal contradiction, but evidence availability falls below the minimum verification threshold.',
      details: [],
      impactOnTrust: 'Uncertainty remains high due to missing transcript and poor signal quality.',
    },

    videoAnalysis: {
      framesAnalyzed: 180,
      visualSyntheticScore: 0.35,
      visualUncertainty: 'HIGH (Degraded Media Resolution)',
      suspiciousIntervals: [
        { start: '00:00', end: '00:12.0', status: 'NORMAL', label: 'Uncertain / Low Signal Quality' },
      ],
      representativeFrames: [
        {
          frameNumber: 45,
          timestamp: '00:03.00',
          label: 'Underexposed Landmark Failure',
          finding: 'Sensor noise floor obscures facial feature edges; landmark confidence drops to 41%.',
          confidence: 'Low',
        },
      ],
    },

    consistencyNetwork: [
      { source: 'Video Face', target: 'Audio Track', relationship: 'SyncNet Correlation', score: 0.42, status: 'UNCERTAIN', note: 'Low confidence due to shadow occlusions.' },
    ],

    evidenceList: [
      {
        id: 'EV-20',
        modality: 'VIDEO',
        isSupporting: false,
        signalType: 'Sensor Noise Profile',
        score: 0.38,
        direction: 'INSUFFICIENT',
        uncertainty: 'High',
        timeRange: '00:00 - 00:12.0',
        observation: 'High ISO thermal sensor noise overwhelms high-frequency forensic analysis.',
        reasoning: 'Inability to isolate generative pixel noise from hardware camera grain.',
      },
      {
        id: 'EV-21',
        modality: 'AUDIO',
        isSupporting: false,
        signalType: 'Acoustic Signal-to-Noise',
        score: 0.40,
        direction: 'INSUFFICIENT',
        uncertainty: 'High',
        timeRange: '00:00 - 00:12.0',
        observation: 'Acoustic signal dominated by 60Hz hum and traffic rumble.',
        reasoning: 'Speech band cannot be isolated with statistical significance.',
      },
    ],

    timeline: [
      { step: 'Evidence Intake', timestamp: '22:30:01', status: 'COMPLETED', detail: 'Received surveillance MP4.' },
      { step: 'Signal Quality Assessment', timestamp: '22:30:05', status: 'COMPLETED', detail: 'Detected low SNR and shadow occlusions.' },
      { step: 'Transcription Attempt', timestamp: '22:30:10', status: 'COMPLETED', detail: 'Whisper failed to decode speech (SNR < 4dB).' },
      { step: 'Trust Assessment', timestamp: '22:30:15', status: 'COMPLETED', detail: 'Assessment: UNCERTAIN (Insufficient Evidence).' },
    ],
  },
  {
    id: 'INV-2026-004',
    name: 'Financial Analyst Forecast Video',
    filename: 'analyst_q3_forecast.mov',
    fileSize: '33.1 MB',
    fileType: 'video/quicktime',
    duration: '00:22',
    resolution: '1920x1080',
    fps: 30,
    sha256: '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
    createdAt: '2026-10-01T11:15:00Z',
    status: 'COMPLETED',
    isDemo: true,

    assessment: {
      verdict: 'PROBABLY MANIPULATED',
      summary: 'Significant generative acoustic traces and lip-sync alignment drift detected between 00:08 and 00:16. Authentic background video spliced with synthetic voiceover.',
      confidenceExplanation: 'Clear vocoder phase anomalies coupled with drifting viseme timing indicate audio re-voicing.',
      engineeringTrustIndex: 28,
      syntheticScore: 0.74,
      syntheticLabel: 'MODERATE-HIGH SYNTHETIC',
      consistencyScore: 0.38,
      consistencyLabel: 'DISAGREEMENT DETECTED',
      evidenceCoverage: 88,
      conflictDetected: true,
      insufficientEvidence: false,
    },

    twoAxis: {
      synthetic: 0.74,
      consistency: 0.38,
      quadrant: 'AI MANIPULATION (HIGH SYNTHETIC / LOW CONSISTENCY)',
    },

    coverage: [
      { modality: 'VIDEO', label: 'Video Frames', analyzed: true, isSupporting: false, coverage: 100, detail: 'Original video recording authentic' },
      { modality: 'AUDIO', label: 'Audio Spectrum', analyzed: true, isSupporting: false, coverage: 95, detail: 'Synthetic voice cloning patterns detected' },
      { modality: 'TRANSCRIPT', label: 'Speech Transcript', analyzed: true, isSupporting: false, coverage: 92, detail: 'Transcript aligns with synthetic audio' },
      { modality: 'CROSS_MODAL', label: 'Lip-Sync Correlation', analyzed: true, isSupporting: false, coverage: 82, detail: 'SyncNet drift in segment 00:08 - 00:16' },
      { modality: 'FACE', label: 'Face Consistency', analyzed: true, isSupporting: true, coverage: 70, detail: 'Natural biological motion in video (Supporting)' },
    ],

    conflict: {
      detected: true,
      title: 'Audio Re-voicing Mismatch',
      severity: 'HIGH',
      description: 'Video frames show natural human motion, but audio speech stream exhibits neural cloning artifacts and drifts out of synchronization.',
      details: [
        {
          pair: 'Audio Formants ⟷ Video Mouth Velocity',
          status: 'DRIFTING',
          explanation: 'Lip motion matches original cadence until 00:08 where revised forecast numbers are spoken.',
        },
      ],
      impactOnTrust: 'Selective re-voicing reduces overall authenticity trust to Probably Manipulated.',
    },

    videoAnalysis: {
      framesAnalyzed: 660,
      visualSyntheticScore: 0.22,
      visualUncertainty: 'LOW',
      suspiciousIntervals: [
        { start: '00:00', end: '00:08.0', status: 'NORMAL', label: 'Original Speech' },
        { start: '00:08.0', end: '00:16.2', status: 'SUSPICIOUS', label: 'Voice Clone Audio Splice' },
        { start: '00:16.2', end: '00:22.0', status: 'NORMAL', label: 'Original Outro' },
      ],
      representativeFrames: [
        {
          frameNumber: 310,
          timestamp: '00:10.33',
          label: 'Mouth Shape Splicing',
          finding: 'Speaker mouth articulates "two point four" while audio vocalizes "seven point eight".',
          confidence: 'High',
        },
      ],
    },

    consistencyNetwork: [
      { source: 'Video Face', target: 'Audio Track', relationship: 'SyncNet Lip-Voice Timing', score: 0.38, status: 'CONFLICT', note: 'Speech divergence in central interval.' },
      { source: 'Transcript', target: 'Audio Track', relationship: 'Speech-to-Text Mapping', score: 0.94, status: 'AGREEMENT', note: 'Transcript matches audio track.' },
    ],

    evidenceList: [
      {
        id: 'EV-30',
        modality: 'AUDIO',
        isSupporting: false,
        signalType: 'Cloned Vocoder Spectral Steps',
        score: 0.78,
        direction: 'SUSPICIOUS_ARTIFACT',
        uncertainty: 'Low',
        timeRange: '00:08.0 - 00:16.2',
        observation: 'Steep spectral step artifacts at 00:08.02 and 00:16.18 marking audio edit boundaries.',
        reasoning: 'Background room tone drops 6dB abruptly at audio splice cut points.',
      },
      {
        id: 'EV-31',
        modality: 'CROSS_MODAL',
        isSupporting: false,
        signalType: 'SyncNet Viseme Mismatch',
        score: 0.32,
        direction: 'CROSS_MODAL_CONFLICT',
        uncertainty: 'Low',
        timeRange: '00:08.0 - 00:16.2',
        observation: 'Visual vowel elongation contradicts short audio syllable duration.',
        reasoning: 'Desynchronization is isolated to the financial numbers segment.',
      },
      {
        id: 'EV-32',
        modality: 'FACE',
        isSupporting: true,
        signalType: 'Facial Muscle Naturalism (Supporting)',
        score: 0.82,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:22.0',
        observation: 'Visual face recording is authentic; only the audio was manipulated.',
        reasoning: 'Supporting evidence confirms video container was not synthesized.',
      },
    ],

    timeline: [
      { step: 'Evidence Intake', timestamp: '11:15:01', status: 'COMPLETED', detail: 'Received analyst video.' },
      { step: 'Audio Dissection', timestamp: '11:15:08', status: 'COMPLETED', detail: 'Identified acoustic splice boundaries.' },
      { step: 'SyncNet Correlation', timestamp: '11:15:16', status: 'COMPLETED', detail: 'Detected desynchronized region 00:08 - 00:16.' },
      { step: 'Trust Assessment', timestamp: '11:15:22', status: 'COMPLETED', detail: 'Assessment: PROBABLY MANIPULATED.' },
    ],
  },
  {
    id: 'INV-2026-005',
    name: 'Field Journalism Broadcast Feed',
    filename: 'field_report_storm_ch8.mp4',
    fileSize: '19.6 MB',
    fileType: 'video/mp4',
    duration: '00:15',
    resolution: '1280x720',
    fps: 30,
    sha256: '9876543210abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    createdAt: '2026-09-30T18:40:00Z',
    status: 'COMPLETED',
    isDemo: true,

    assessment: {
      verdict: 'PROBABLY TRUSTED',
      summary: 'Heavy compression artifacts and wind buffeting are present, but cross-modal physical and biological consistency remains intact. No generative synthesis signatures found.',
      confidenceExplanation: 'TrustLayer distinguished video compression macroblocking from generative neural diffusion artifacts.',
      engineeringTrustIndex: 82,
      syntheticScore: 0.21,
      syntheticLabel: 'LOW SYNTHETIC (COMPRESSION NOISE)',
      consistencyScore: 0.88,
      consistencyLabel: 'HIGH CONSISTENCY',
      evidenceCoverage: 84,
      conflictDetected: false,
      insufficientEvidence: false,
    },

    twoAxis: {
      synthetic: 0.21,
      consistency: 0.88,
      quadrant: 'AUTHENTIC BASELINE (LOW SYNTHETIC / HIGH CONSISTENCY)',
    },

    coverage: [
      { modality: 'VIDEO', label: 'Video Frames', analyzed: true, isSupporting: false, coverage: 90, detail: '450 frames analyzed; macroblocking isolated' },
      { modality: 'AUDIO', label: 'Audio Spectrum', analyzed: true, isSupporting: false, coverage: 85, detail: 'Natural wind turbulence microphone saturation' },
      { modality: 'TRANSCRIPT', label: 'Speech Transcript', analyzed: true, isSupporting: false, coverage: 80, detail: 'Transcript aligns with broadcast audio' },
      { modality: 'CROSS_MODAL', label: 'Lip-Sync Correlation', analyzed: true, isSupporting: false, coverage: 85, detail: 'SyncNet tracks despite wind noise' },
      { modality: 'FACE', label: 'Face Consistency', analyzed: true, isSupporting: true, coverage: 78, detail: 'Natural squinting & wind reflexes (Supporting)' },
    ],

    conflict: {
      detected: false,
      title: 'No Conflict Detected',
      severity: 'NONE',
      description: 'Acoustic wind noise and visual environmental storm cues correlate coherently.',
      details: [],
      impactOnTrust: 'Environmental correlation reinforces trust.',
    },

    videoAnalysis: {
      framesAnalyzed: 450,
      visualSyntheticScore: 0.18,
      visualUncertainty: 'LOW-MEDIUM',
      suspiciousIntervals: [
        { start: '00:00', end: '00:15.0', status: 'NORMAL', label: 'Authentic Compressed Media' },
      ],
      representativeFrames: [
        {
          frameNumber: 120,
          timestamp: '00:04.00',
          label: 'H.264 Macroblock Verification',
          finding: 'Artifacts conform to standard discrete cosine transform (DCT) block quantization, not generative diffusion.',
          confidence: 'High',
        },
      ],
    },

    consistencyNetwork: [
      { source: 'Video Face', target: 'Audio Track', relationship: 'SyncNet Lip-Voice Timing', score: 0.88, status: 'AGREEMENT', note: 'Phonemes match lip movement.' },
      { source: 'Wind Turbulence', target: 'Rain Geometry', relationship: 'Environmental Consistency', score: 0.92, status: 'AGREEMENT', note: 'Microphone gusts align with visible rain trajectory.' },
    ],

    evidenceList: [
      {
        id: 'EV-40',
        modality: 'VIDEO',
        isSupporting: false,
        signalType: 'DCT Quantization Filter',
        score: 0.19,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:15.0',
        observation: 'Blocking noise strictly follows 8x8 DCT grid, disproving generative face-swap synthesis.',
        reasoning: 'Fourier transforms exhibit standard transmission encoding characteristics.',
      },
      {
        id: 'EV-41',
        modality: 'CROSS_MODAL',
        isSupporting: false,
        signalType: 'SyncNet Correlation',
        score: 0.88,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:15.0',
        observation: 'Mouth movement tracks spoken broadcast report within natural timing tolerances.',
        reasoning: 'Continuous agreement verifies authenticity despite harsh field conditions.',
      },
      {
        id: 'EV-42',
        modality: 'FACE',
        isSupporting: true,
        signalType: 'Physiological Wind Reflex (Supporting)',
        score: 0.86,
        direction: 'CONFIRMS_AUTHENTIC',
        uncertainty: 'Low',
        timeRange: '00:00 - 00:15.0',
        observation: 'Squint reflexes dynamically correlate with audio wind velocity gusts.',
        reasoning: 'Cross-modal physiological correlation supports authentic field recording.',
      },
    ],

    timeline: [
      { step: 'Evidence Intake', timestamp: '18:40:01', status: 'COMPLETED', detail: 'Received broadcast MP4.' },
      { step: 'Noise Dissection', timestamp: '18:40:07', status: 'COMPLETED', detail: 'Separated transmission compression from neural artifacts.' },
      { step: 'Environmental Fusion', timestamp: '18:40:15', status: 'COMPLETED', detail: 'Correlated visual rain with audio wind gusts.' },
      { step: 'Trust Assessment', timestamp: '18:40:20', status: 'COMPLETED', detail: 'Assessment: PROBABLY TRUSTED.' },
    ],
  },
];

/**
/**
 * Normalize investigation payload from backend or disk into canonical frontend model
 */
function normalizeInvestigation(data) {
  if (!data) return null;
  const invId = data.id || data.investigation_id || `INV-${Date.now()}`;
  const rawAss = data.assessment || {};
  const verdict = rawAss.verdict || 'UNCERTAIN';
  const syntheticScore = rawAss.synthetic_score !== undefined ? Number(rawAss.synthetic_score) : (rawAss.syntheticScore ?? 0.5);
  const consistencyScore = rawAss.consistency_score !== undefined ? Number(rawAss.consistency_score) : (rawAss.consistencyScore ?? 0.5);
  
  let evidenceCoverage = 50;
  if (rawAss.evidence_coverage !== undefined) {
    const rawCov = Number(rawAss.evidence_coverage);
    evidenceCoverage = rawCov <= 1.0 ? Math.round(rawCov * 100) : Math.round(rawCov);
  } else if (rawAss.evidenceCoverage !== undefined) {
    evidenceCoverage = Math.round(Number(rawAss.evidenceCoverage));
  }

  const conflictDetected = Boolean(rawAss.conflict !== undefined ? rawAss.conflict : rawAss.conflictDetected);

  const assessment = {
    verdict: verdict,
    summary: data.explanation || rawAss.summary || 'Deterministic evidence fusion completed.',
    confidenceExplanation: rawAss.confidenceExplanation || (
      data.explanation
        ? 'Explanation generated from structured multi-sensor forensic evidence.'
        : 'Assessment derived strictly from multi-sensor evidence fusion.'
    ),
    engineeringTrustIndex: Math.round(Math.max(0, Math.min(100, (1.0 - syntheticScore) * (consistencyScore) * 100))),
    syntheticScore: syntheticScore,
    synthetic_score: syntheticScore,
    syntheticLabel: syntheticScore >= 0.65 ? 'HIGH SYNTHETIC EVIDENCE' : syntheticScore <= 0.35 ? 'LOW SYNTHETIC EVIDENCE' : 'MODERATE SYNTHETIC',
    consistencyScore: consistencyScore,
    consistency_score: consistencyScore,
    consistencyLabel: consistencyScore >= 0.70 ? 'HIGH CONSISTENCY' : consistencyScore <= 0.35 ? 'CRITICAL CONFLICT' : 'MODERATE CONSISTENCY',
    evidenceCoverage: evidenceCoverage,
    evidence_coverage: evidenceCoverage,
    conflictDetected: conflictDetected,
    conflict: conflictDetected,
    insufficientEvidence: verdict.includes('INSUFFICIENT') || verdict === 'UNCERTAIN',
  };

  const twoAxis = data.twoAxis || {
    synthetic: syntheticScore,
    consistency: consistencyScore,
    quadrant: data.twoAxis?.quadrant || (
      verdict === 'AUTHENTIC' || verdict === 'TRUSTED' ? 'AUTHENTIC BASELINE'
      : verdict === 'COORDINATED SYNTHETIC' ? 'COORDINATED SYNTHETIC'
      : verdict === 'MANIPULATED' ? 'AI MANIPULATION'
      : 'UNRESOLVED UNCERTAINTY'
    ),
  };

  return {
    ...data,
    id: invId,
    investigation_id: invId,
    name: data.name || `Evidence Dissection // ${data.filename || 'uploaded_evidence.mp4'}`,
    filename: data.filename || 'uploaded_evidence.mp4',
    fileSize: data.fileSize || 'Unknown size',
    fileType: data.fileType || 'video/mp4',
    duration: data.duration || '00:00',
    resolution: data.resolution || '1280x720',
    fps: data.fps || 30,
    sha256: data.sha256 || '0'.repeat(64),
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || 'COMPLETED',
    isDemo: Boolean(data.isDemo),
    assessment: assessment,
    twoAxis: twoAxis,
    coverage: data.coverage || [],
    conflict: data.conflict || {
      detected: conflictDetected,
      title: conflictDetected ? 'Cross-Modal Conflict Detected' : 'No Conflict Detected',
      severity: conflictDetected ? 'HIGH' : 'NONE',
      description: conflictDetected ? 'Contradictory evidence signals detected between modalities.' : 'No contradictory evidence detected.',
      details: [],
    },
    videoAnalysis: data.videoAnalysis || {
      framesAnalyzed: data.evidence?.length || 0,
      visualSyntheticScore: syntheticScore,
      visualUncertainty: 'LOW',
      suspiciousIntervals: [],
      representativeFrames: [],
    },
    evidence: data.evidence || [],
    evidenceList: data.evidenceList || [],
    timeline: data.timeline || [],
    explanation: data.explanation || assessment.summary,
    graph: data.graph || null,
  };
}

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8000';

/**
 * Service API Methods connecting frontend to real TrustLayer backend
 */
export const investigationService = {
  /**
   * List all investigations: combines persisted real investigations with pre-seeded demo cases.
   */
  async listInvestigations() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/investigations`, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const backendItems = await res.json();
        const normalizedBackend = backendItems.map(normalizeInvestigation);
        
        // Merge with demo items (deduplicated by ID)
        const backendIds = new Set(normalizedBackend.map(b => b.id.toUpperCase()));
        const remainingDemos = investigationsStore
          .filter(d => d.isDemo && !backendIds.has(d.id.toUpperCase()))
          .map(normalizeInvestigation);
        
        return [...normalizedBackend, ...remainingDemos];
      }
    } catch {
      // Backend offline or unreachable fallback to local store
    }
    return investigationsStore.map(normalizeInvestigation);
  },

  /**
   * Get an investigation by ID (checks memory/demos, then queries real backend API)
   */
  async getInvestigation(id) {
    if (!id) return investigationsStore[0];

    // Check in-memory store first
    const localMatch = investigationsStore.find(
      item => item.id.toUpperCase() === id.toUpperCase()
    );

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/investigation/${encodeURIComponent(id)}`, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const backendData = await res.json();
        const normalized = normalizeInvestigation(backendData);
        // Cache or update in local array
        const idx = investigationsStore.findIndex(i => i.id.toUpperCase() === id.toUpperCase());
        if (idx >= 0) {
          investigationsStore[idx] = normalized;
        } else {
          investigationsStore.unshift(normalized);
        }
        return normalized;
      }
    } catch {
      // Return cached/demo if API is offline
    }

    if (localMatch) {
      return normalizeInvestigation(localMatch);
    }

    // Default to first demo case if id not found anywhere
    return normalizeInvestigation(investigationsStore[0]);
  },

  /**
   * Create a new investigation via real backend API:
   * Dispatches multipart file upload to POST /api/v1/investigation/upload,
   * runs real ML inference (ViT + AASIST + Whisper + SyncNet + TrustEngine + Gemini),
   * persists the investigation, and returns the canonical result.
   */
  async createInvestigation({ videoFile, audioFile, transcriptText, onProgress }) {
    if (!videoFile) {
      throw new Error('A valid video file is required to initiate an investigation.');
    }

    const formData = new FormData();
    formData.append('video_file', videoFile);
    if (audioFile) {
      formData.append('audio_file', audioFile);
    }
    if (transcriptText && transcriptText.trim()) {
      formData.append('transcript_text', transcriptText.trim());
    }

    // Progress stages mapped to real pipeline execution
    const stages = [
      { stage: 'VALIDATING', note: 'Validating media container and computing cryptographic hash' },
      { stage: 'EXTRACTING', note: 'Extracting keyframes and acoustic audio spectrogram' },
      { stage: 'ANALYZING', note: 'Scanning visual diffusion boundaries and vocoder frequencies' },
      { stage: 'CHECKING CONSISTENCY', note: 'Correlating SyncNet lip velocity with audio phonemes' },
      { stage: 'FUSING EVIDENCE', note: 'Mathematical evidence graph assembly and uncertainty calibration' },
      { stage: 'ASSESSING TRUST', note: 'Synthesizing evidence-backed trust assessment' },
    ];

    let progressTimer = null;
    if (onProgress) {
      let stageIndex = 0;
      onProgress({
        stageIndex: 0,
        totalStages: stages.length,
        stageName: stages[0].stage,
        note: stages[0].note,
        percent: 15,
      });

      progressTimer = setInterval(() => {
        stageIndex = Math.min(stageIndex + 1, stages.length - 1);
        onProgress({
          stageIndex,
          totalStages: stages.length,
          stageName: stages[stageIndex].stage,
          note: stages[stageIndex].note,
          percent: Math.round(((stageIndex + 1) / stages.length) * 95),
        });
      }, 1200);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/investigation/upload`, {
        method: 'POST',
        body: formData,
      });

      if (progressTimer) clearInterval(progressTimer);

      if (!response.ok) {
        let errorMsg = `Server error ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson && errJson.detail) {
            errorMsg = errJson.detail;
          }
        } catch {
          // Non-JSON error body
        }
        throw new Error(`Investigation failed: ${errorMsg}`);
      }

      if (onProgress) {
        onProgress({
          stageIndex: stages.length - 1,
          totalStages: stages.length,
          stageName: 'COMPLETED',
          note: 'Forensic evaluation and deterministic fusion complete.',
          percent: 100,
        });
      }

      const realResult = await response.json();
      const normalized = normalizeInvestigation(realResult);

      // Add to front of store
      investigationsStore.unshift(normalized);
      return normalized;
    } catch (err) {
      if (progressTimer) clearInterval(progressTimer);
      throw err;
    }
  },
};

