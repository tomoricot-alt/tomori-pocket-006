# TOMORI POCKET（APP 006）

中高生がおこづかいの使い道を記録し、お金を計画的に使うための家計簿アプリ。
TOMORI APP LAB（50アプリ開発プロジェクト）第6号。

- 公開URL（予定）: https://tomoricot-alt.github.io/tomori-pocket-006/
- 技術: React Native / Expo (SDK 57) / TypeScript / React Native Web
- サーバー・ログイン・銀行連携・課金・外部APIは一切なし。**データは端末のブラウザ内（localStorage）だけに保存**され、外部へ送信されません。
- ⚠️ ブラウザのサイトデータ・履歴を削除すると、記録が消える可能性があります（アプリ内にも明記）。

## 機能

| 画面 | 内容 |
|---|---|
| ホーム | 現在の残高、今月の収入・支出、最近の記録、初期残高の設定 |
| 記録 | 収入（おこづかい／お年玉／その他）・支出（飲食／文房具／趣味・ゲーム／交通費／その他）の登録。編集・削除も同じ画面 |
| 履歴 | 月別の一覧、収入／支出の絞り込み、タップで編集・削除 |
| 集計 | 月別のカテゴリ別支出（棒グラフ）、月ごとの収支と月末残高 |

## 仕様

- 金額は日本円の**正の整数**（1〜99,999,999円）。全角数字・カンマ・「円」は許容。空、0、負数、小数、文字、上限超えは登録不可。初期残高のみ0を許可。
- 残高 = 初期残高 + 全収入 − 全支出（マイナスになる場合あり）。
- 日付は `YYYY-MM-DD`（実在日のみ。`2025/4/1`・全角も補正）。ローカル日付で扱い、UTCずれを避ける。
- 保存データは読み込み時に検証し、壊れた記録は破棄。保存キー: `tomori-pocket-006:data:v1`。
- 本名・学校名・口座・カード情報の入力欄は一切なし。
- 計算ロジック（`src/logic/`）と表示（`src/screens/`, `src/components/`）を分離。

## ディレクトリ

```
App.tsx / index.ts      アプリ本体（タブ切替）
src/logic/              計算・検証（純粋関数、UI非依存）
src/screens, components 画面・部品
src/storage.ts          端末内保存
__tests__/              ユニットテスト（Jest）
docs/                   USER_GUIDE.md, DEV_REPORT.md
.github/workflows/      CI と GitHub Pages 公開
```

## 起動方法

```bash
npm ci
npm run web        # ブラウザで開発サーバー起動
npm run typecheck  # 型チェック
npm test           # ユニットテスト
npm run build:web  # 公開用ビルド（dist/）
```

## 公開方法（GitHub Pages）

1. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする。
2. Pull Request を確認・承認し、**main にマージ**する。
3. `.github/workflows/deploy.yml` が型チェック → テスト → ビルド → 自動公開を行う。
4. https://tomoricot-alt.github.io/tomori-pocket-006/ で確認。

PR 時は型チェック・テスト・ビルドのみ実行し、公開はしません。サブパス用の設定は `app.json` の `experiments.baseUrl` です。

## ドキュメント

- [中高生向け説明書](docs/USER_GUIDE.md)
- [開発レポート](docs/DEV_REPORT.md)
