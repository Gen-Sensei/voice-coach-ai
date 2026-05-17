from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PitchMetrics(BaseModel):
    mean_hz: Optional[float]
    min_hz: Optional[float]
    max_hz: Optional[float]
    range_hz: Optional[float]
    std_hz: Optional[float]

class IntensityMetrics(BaseModel):
    mean_db: Optional[float]
    min_db: Optional[float]
    max_db: Optional[float]
    range_db: Optional[float]
    std_db: Optional[float]

class SilenceMetrics(BaseModel):
    count: int
    long_count: int
    avg_sec: float
    max_sec: float

class BasicMetrics(BaseModel):
    speech_sec: float
    silence_sec: float
    speech_ratio: float

class VoiceQuality(BaseModel):
    jitter_local: Optional[float] = None
    shimmer_local: Optional[float] = None
    hnr_db: Optional[float] = None

class Scores(BaseModel):
    overall: int
    intonation: int
    pause: int
    volume_stability: int
    recording_quality: int

class Comments(BaseModel):
    summary: str
    strengths: List[str]
    improvements: List[str]
    next_training: List[str]

class AnalysisResult(BaseModel):
    analysis_id: str
    file_name: str
    duration_sec: float
    basic: BasicMetrics
    pitch: PitchMetrics
    intensity: IntensityMetrics
    silence: SilenceMetrics
    voice_quality: VoiceQuality
    scores: Scores
    comments: Comments
    created_at: Optional[str] = None

class HistoryItem(BaseModel):
    analysis_id: str
    created_at: str
    duration_sec: float
    overall_score: int
    file_name: str
