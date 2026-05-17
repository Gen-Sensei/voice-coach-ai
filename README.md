# Voice Coach AI

発声・話し方改善のためのAI音声分析Webアプリ

## 概要

ブラウザで音声を録音またはアップロードし、Parselmouth（Praat相当）を使って音響分析を行い、発声練習・プレゼン練習に役立つ診断結果を表示します。

## 技術スタック

- **Frontend**: Next.js 14 / React / TypeScript / Tailwind CSS / Recharts
- **Backend**: Python / FastAPI
- **音声分析**: Parselmouth, pydub
- **DB**: SQLite
- **音声変換**: ffmpeg

## セットアップ

### 前提条件

- Node.js 18+
- Python 3.10+
- ffmpeg

### ffmpegのインストール

**Mac (Homebrew)**:
```bash
brew install ffmpeg
```

**Ubuntu**:
```bash
sudo apt install ffmpeg
```

**Windows**: https://ffmpeg.org/download.html からダウンロード

### バックエンド起動

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### フロントエンド起動

```bash
cd frontend
npm install
npm run dev
```

ブラウザで http://localhost:3001 を開く

## API仕様

### POST /api/analyze
音声ファイルを分析する

**リクエスト**: multipart/form-data
- `file`: 音声ファイル（wav/mp3/m4a/webm、最大30MB）
- `task_type`: reading / free_speech / sustained_vowel
- `prompt_text`: 読み上げ課題文（任意）

**レスポンス**: 分析結果JSON（ピッチ・音量・無音・スコア・コメント）

### GET /api/history
過去の分析一覧を取得する

### GET /api/result/{analysis_id}
特定の分析結果を取得する

## 注意事項

本アプリは発声練習・話し方改善のためのセルフトレーニングツールです。医療的な診断・治療には使用できません。
