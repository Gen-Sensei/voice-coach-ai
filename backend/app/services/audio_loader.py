import os
import subprocess
import tempfile
from pathlib import Path

SUPPORTED_FORMATS = {"wav", "mp3", "m4a", "webm"}
MAX_FILE_SIZE = 30 * 1024 * 1024  # 30MB
MAX_DURATION = 180  # 3 minutes
MIN_DURATION = 5    # 5 seconds

def validate_file(filename: str, size: int) -> None:
    ext = Path(filename).suffix.lower().lstrip(".")
    if ext not in SUPPORTED_FORMATS:
        raise ValueError(f"対応形式は wav, mp3, m4a, webm です。")
    if size > MAX_FILE_SIZE:
        raise ValueError("30MB以下のファイルをアップロードしてください。")

def convert_to_wav(input_path: str) -> str:
    """Convert audio file to wav format using ffmpeg."""
    output_path = input_path.rsplit(".", 1)[0] + "_converted.wav"
    try:
        result = subprocess.run(
            ["ffmpeg", "-y", "-i", input_path, "-ar", "16000", "-ac", "1", output_path],
            capture_output=True,
            timeout=60
        )
        if result.returncode != 0:
            raise RuntimeError(f"ffmpegの変換に失敗しました: {result.stderr.decode()}")
    except FileNotFoundError:
        raise RuntimeError("ffmpegがインストールされていません。")
    return output_path

def get_duration(file_path: str) -> float:
    """Get audio duration in seconds using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", file_path],
            capture_output=True, text=True, timeout=30
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0
