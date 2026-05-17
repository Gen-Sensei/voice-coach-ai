import numpy as np
from typing import Optional

def analyze_with_praat(file_path: str) -> dict:
    try:
        import parselmouth
        sound = parselmouth.Sound(file_path)
    except Exception as e:
        raise RuntimeError(f"音声ファイルの読み込みに失敗しました: {e}")

    duration = sound.get_total_duration()

    # Pitch analysis
    pitch_result = {"mean_hz": None, "min_hz": None, "max_hz": None, "range_hz": None, "std_hz": None}
    try:
        pitch = sound.to_pitch()
        pitch_values = pitch.selected_array["frequency"]
        pitch_values = pitch_values[pitch_values > 0]
        if len(pitch_values) > 0:
            pitch_result = {
                "mean_hz": round(float(np.mean(pitch_values)), 2),
                "min_hz": round(float(np.min(pitch_values)), 2),
                "max_hz": round(float(np.max(pitch_values)), 2),
                "range_hz": round(float(np.max(pitch_values) - np.min(pitch_values)), 2),
                "std_hz": round(float(np.std(pitch_values)), 2),
            }
    except Exception:
        pass

    # Intensity analysis
    intensity_result = {"mean_db": None, "min_db": None, "max_db": None, "range_db": None, "std_db": None}
    try:
        intensity = sound.to_intensity()
        intensity_values = intensity.values[0]
        intensity_values = intensity_values[intensity_values > 0]
        if len(intensity_values) > 0:
            intensity_result = {
                "mean_db": round(float(np.mean(intensity_values)), 2),
                "min_db": round(float(np.min(intensity_values)), 2),
                "max_db": round(float(np.max(intensity_values)), 2),
                "range_db": round(float(np.max(intensity_values) - np.min(intensity_values)), 2),
                "std_db": round(float(np.std(intensity_values)), 2),
            }
    except Exception:
        pass

    # Voice quality (optional)
    voice_quality = {"jitter_local": None, "shimmer_local": None, "hnr_db": None}
    try:
        harmonicity = sound.to_harmonicity()
        hnr_values = harmonicity.values[0]
        hnr_values = hnr_values[hnr_values > -200]
        if len(hnr_values) > 0:
            voice_quality["hnr_db"] = round(float(np.mean(hnr_values)), 2)
    except Exception:
        pass

    return {
        "duration_sec": round(duration, 2),
        "pitch": pitch_result,
        "intensity": intensity_result,
        "voice_quality": voice_quality,
    }
