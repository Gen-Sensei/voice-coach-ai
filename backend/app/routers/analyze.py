import os
import uuid
import json
import shutil
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
from app.services.audio_loader import validate_file, convert_to_wav, get_duration, MAX_DURATION, MIN_DURATION
from app.services.praat_analyzer import analyze_with_praat
from app.services.silence_analyzer import analyze_silence
from app.services.scoring import calculate_scores
from app.services.comment_generator import generate_comments
from app.models.database import get_connection
from app.models.schemas import AnalysisResult

router = APIRouter()

UPLOAD_DIR = "app/storage/uploads"

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_audio(
    file: UploadFile = File(...),
    task_type: str = Form("free_speech"),
    user_id: str = Form(None),
    prompt_text: str = Form(None),
):
    # Validate
    content = await file.read()
    try:
        validate_file(file.filename, len(content))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    analysis_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix.lower()
    save_path = os.path.join(UPLOAD_DIR, f"{analysis_id}{ext}")

    with open(save_path, "wb") as f:
        f.write(content)

    # Convert to wav if needed
    wav_path = save_path
    try:
        if ext != ".wav":
            wav_path = convert_to_wav(save_path)
    except RuntimeError as e:
        os.remove(save_path)
        raise HTTPException(status_code=500, detail=str(e))

    # Check duration
    duration = get_duration(wav_path)
    if duration < MIN_DURATION:
        _cleanup(save_path, wav_path)
        raise HTTPException(status_code=400, detail="5秒以上の音声を録音してください。")
    if duration > MAX_DURATION:
        _cleanup(save_path, wav_path)
        raise HTTPException(status_code=400, detail="3分以内の音声にしてください。")

    # Analyze
    try:
        praat_result = analyze_with_praat(wav_path)
        silence_result = analyze_silence(wav_path)
    except RuntimeError as e:
        _cleanup(save_path, wav_path)
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        _cleanup(save_path, wav_path)
        raise HTTPException(status_code=500, detail="音声分析に失敗しました。別のファイルでお試しください。")

    metrics = {
        "duration_sec": praat_result["duration_sec"],
        "pitch": praat_result["pitch"],
        "intensity": praat_result["intensity"],
        "silence": silence_result["silence"],
        "basic": silence_result["basic"],
    }

    scores = calculate_scores(metrics)
    comments = generate_comments(metrics, scores)

    result = {
        "analysis_id": analysis_id,
        "file_name": file.filename,
        "duration_sec": metrics["duration_sec"],
        "basic": metrics["basic"],
        "pitch": metrics["pitch"],
        "intensity": metrics["intensity"],
        "silence": metrics["silence"],
        "voice_quality": praat_result["voice_quality"],
        "scores": scores,
        "comments": comments,
        "created_at": datetime.now().isoformat(),
    }

    # Save to DB
    conn = get_connection()
    conn.execute(
        """INSERT INTO analyses (id, user_id, file_name, file_path, task_type, duration_sec, overall_score, result_json, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (analysis_id, user_id, file.filename, save_path, task_type,
         metrics["duration_sec"], scores["overall"], json.dumps(result, ensure_ascii=False),
         datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

    # Clean up converted wav if different from original
    if wav_path != save_path and os.path.exists(wav_path):
        os.remove(wav_path)

    return result

def _cleanup(*paths):
    for p in paths:
        if p and os.path.exists(p):
            os.remove(p)
