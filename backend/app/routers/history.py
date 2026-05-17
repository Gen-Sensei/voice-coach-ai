import json
from fastapi import APIRouter, HTTPException
from app.models.database import get_connection
from app.models.schemas import HistoryItem, AnalysisResult
from typing import List

router = APIRouter()

@router.get("/history", response_model=List[HistoryItem])
def get_history():
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, created_at, duration_sec, overall_score, file_name FROM analyses ORDER BY created_at DESC LIMIT 50"
    ).fetchall()
    conn.close()
    return [
        {
            "analysis_id": row["id"],
            "created_at": row["created_at"],
            "duration_sec": row["duration_sec"],
            "overall_score": row["overall_score"],
            "file_name": row["file_name"],
        }
        for row in rows
    ]

@router.get("/result/{analysis_id}", response_model=AnalysisResult)
def get_result(analysis_id: str):
    conn = get_connection()
    row = conn.execute(
        "SELECT result_json FROM analyses WHERE id = ?", (analysis_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="分析結果が見つかりません。")
    return json.loads(row["result_json"])
