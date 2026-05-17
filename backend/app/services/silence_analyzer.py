def analyze_silence(file_path: str) -> dict:
    try:
        from pydub import AudioSegment
        from pydub.silence import detect_silence

        audio = AudioSegment.from_file(file_path)
        silence_ranges = detect_silence(
            audio,
            min_silence_len=300,
            silence_thresh=audio.dBFS - 16
        )
        silence_durations = [(end - start) / 1000 for start, end in silence_ranges]

        total_duration_sec = len(audio) / 1000.0
        total_silence = sum(silence_durations)
        speech_sec = max(0, total_duration_sec - total_silence)
        speech_ratio = round(speech_sec / total_duration_sec, 3) if total_duration_sec > 0 else 0

        return {
            "silence": {
                "count": len(silence_durations),
                "long_count": len([s for s in silence_durations if s >= 1.2]),
                "avg_sec": round(sum(silence_durations) / len(silence_durations), 3) if silence_durations else 0,
                "max_sec": round(max(silence_durations), 3) if silence_durations else 0,
            },
            "basic": {
                "speech_sec": round(speech_sec, 2),
                "silence_sec": round(total_silence, 2),
                "speech_ratio": speech_ratio,
            }
        }
    except Exception as e:
        return {
            "silence": {"count": 0, "long_count": 0, "avg_sec": 0, "max_sec": 0},
            "basic": {"speech_sec": 0, "silence_sec": 0, "speech_ratio": 0},
        }
