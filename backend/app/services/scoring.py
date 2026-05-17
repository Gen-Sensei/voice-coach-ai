def score_intonation(pitch_range_hz, pitch_std_hz) -> int:
    if pitch_range_hz is None:
        return 50
    if pitch_range_hz < 50:
        return 55
    elif pitch_range_hz < 120:
        return 75
    elif pitch_range_hz < 250:
        return 90
    else:
        return 70

def score_pause(silence_count, avg_silence_sec, max_silence_sec, duration_sec) -> int:
    if duration_sec <= 0:
        return 50
    if max_silence_sec > 3.0:
        return 55
    if avg_silence_sec < 0.25:
        return 60
    elif avg_silence_sec <= 1.2:
        return 85
    else:
        return 70

def score_volume_stability(intensity_std_db) -> int:
    if intensity_std_db is None:
        return 50
    if intensity_std_db < 3:
        return 65
    elif intensity_std_db < 10:
        return 85
    else:
        return 70

def calculate_scores(metrics: dict) -> dict:
    intonation = score_intonation(
        metrics["pitch"]["range_hz"],
        metrics["pitch"]["std_hz"]
    )
    pause = score_pause(
        metrics["silence"]["count"],
        metrics["silence"]["avg_sec"],
        metrics["silence"]["max_sec"],
        metrics["duration_sec"]
    )
    volume = score_volume_stability(metrics["intensity"]["std_db"])
    recording_quality = 85
    overall = round(
        intonation * 0.30 +
        pause * 0.30 +
        volume * 0.25 +
        recording_quality * 0.15
    )
    return {
        "overall": overall,
        "intonation": intonation,
        "pause": pause,
        "volume_stability": volume,
        "recording_quality": recording_quality,
    }
