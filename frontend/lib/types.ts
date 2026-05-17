export interface PitchMetrics {
  mean_hz: number | null
  min_hz: number | null
  max_hz: number | null
  range_hz: number | null
  std_hz: number | null
}

export interface IntensityMetrics {
  mean_db: number | null
  min_db: number | null
  max_db: number | null
  range_db: number | null
  std_db: number | null
}

export interface SilenceMetrics {
  count: number
  long_count: number
  avg_sec: number
  max_sec: number
}

export interface BasicMetrics {
  speech_sec: number
  silence_sec: number
  speech_ratio: number
}

export interface VoiceQuality {
  jitter_local: number | null
  shimmer_local: number | null
  hnr_db: number | null
}

export interface Scores {
  overall: number
  intonation: number
  pause: number
  volume_stability: number
  recording_quality: number
}

export interface TrainingItem {
  key: string
  label: string
}

export interface Comments {
  summary: string
  strengths: string[]
  improvements: string[]
  next_training: TrainingItem[]
}

export interface AnalysisResult {
  analysis_id: string
  file_name: string
  duration_sec: number
  basic: BasicMetrics
  pitch: PitchMetrics
  intensity: IntensityMetrics
  silence: SilenceMetrics
  voice_quality: VoiceQuality
  scores: Scores
  comments: Comments
  created_at?: string
}

export interface HistoryItem {
  analysis_id: string
  created_at: string
  duration_sec: number
  overall_score: number
  file_name: string
}
