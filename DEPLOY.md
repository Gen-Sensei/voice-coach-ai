# デプロイ手順

## 構成

- **フロントエンド**: Vercel（無料）
- **バックエンド**: Render（無料）
- **DB**: SQLite（無料・揮発性）

---

## 1. GitHubにpushする

```bash
cd voice-coach-ai
git init
git add .
git commit -m "initial commit"
```

GitHubで新しいリポジトリを作成し、以下を実行：

```bash
git remote add origin https://github.com/あなたのユーザー名/voice-coach-ai.git
git push -u origin main
```

---

## 2. バックエンドをRenderにデプロイ

1. https://render.com にサインアップ（GitHubアカウントで可）
2. 「New +」→「Web Service」
3. GitHubリポジトリを接続
4. 以下を設定：

| 項目 | 値 |
|------|----|
| Name | voice-coach-ai-backend |
| Root Directory | backend |
| Runtime | Docker |
| Instance Type | Free |

5. 「Environment Variables」に以下を追加：

| キー | 値 |
|------|----|
| `ALLOWED_ORIGINS` | （後でVercelのURLを入れる） |

6. 「Create Web Service」をクリック
7. デプロイが完了したら表示されるURL（例: `https://voice-coach-ai-backend.onrender.com`）をメモする

---

## 3. フロントエンドをVercelにデプロイ

1. https://vercel.com にサインアップ（GitHubアカウントで可）
2. 「Add New Project」→ GitHubリポジトリを選択
3. 「Root Directory」を `frontend` に設定
4. 「Environment Variables」に以下を追加：

| キー | 値 |
|------|----|
| `NEXT_PUBLIC_API_URL` | `https://voice-coach-ai-backend.onrender.com`（Renderで取得したURL） |

5. 「Deploy」をクリック
6. 完了後に表示されるURL（例: `https://voice-coach-ai.vercel.app`）をメモする

---

## 4. バックエンドのCORSを更新

RenderのEnvironment Variablesを以下に更新：

| キー | 値 |
|------|----|
| `ALLOWED_ORIGINS` | `https://voice-coach-ai.vercel.app` |

変更後、Renderが自動的に再デプロイされます。

---

## 無料プランの制限事項

| 制限 | 内容 |
|------|------|
| スリープ | 15分アクセスがないとバックエンドがスリープ。次のリクエスト時に〜30秒かかる |
| 履歴リセット | Renderの無料プランはディスクが揮発性のため、再起動で分析履歴が消える |
| 帯域 | 月100GB（通常の用途では十分） |

## 有料プランへのアップグレード（スリープ解消・履歴永続化）

Renderで「Starter」($7/月)にアップグレードすると：
- スリープなし（常時起動）
- ディスク永続化オプション追加可能（$0.25/GB/月）
