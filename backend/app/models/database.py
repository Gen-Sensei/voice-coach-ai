import sqlite3
import os

DB_PATH = os.environ.get("DB_PATH", "voice_coach.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            file_name TEXT,
            file_path TEXT,
            task_type TEXT,
            duration_sec REAL,
            overall_score INTEGER,
            result_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
