# reCAPTCHA ローカル環境セットアップガイド

ローカル環境（`localhost`）でもreCAPTCHAを動作させることができます。

## セットアップ手順

### 1. Google reCAPTCHAキーの取得

1. [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin) にアクセス
2. 「Create」をクリックして新しいサイトを作成
3. **reCAPTCHA v3** を選択
4. **ドメイン設定**で以下を追加：
   - `localhost`
   - `127.0.0.1`（オプション）
5. 利用規約に同意して送信
6. 以下の2つのキーが発行されます：
   - **Site Key**（公開キー）- フロントエンドで使用
   - **Secret Key**（秘密キー）- バックエンドで使用

### 2. 環境変数の設定

#### メインアプリ

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を追加してください：

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**重要**: `your_site_key_here` と `your_secret_key_here` を実際のキーに置き換えてください。

#### AMI Landing Page

`AMI Landing Page/ami-landing-page/` ディレクトリにも `.env.local` ファイルを作成し、同じキーを設定してください。

### 3. 開発サーバーの再起動

環境変数を設定した後、**必ず開発サーバーを再起動**してください：

```bash
# 現在のサーバーを停止（Ctrl+C）
# その後、再度起動
npm run dev
```

### 4. 動作確認

1. ブラウザで `http://localhost:3000` にアクセス
2. コンソールに警告が表示されないことを確認
3. お問い合わせフォーム（`/contact`）やサインアップフォーム（`/signup`）を開く
4. フォームを送信して、正常に動作することを確認

### 5. reCAPTCHA v3について

- **非表示**: reCAPTCHA v3はユーザーに見えない形で動作します
- **スコアベース**: 0.0（ボット）から1.0（人間）までのスコアで判定
- **現在の閾値**: 0.5以上で合格（`app/api/contact/route.ts`で調整可能）

## トラブルシューティング

### 警告が表示される場合

- `.env.local` ファイルが正しい場所にあるか確認
- 環境変数の名前が正確か確認（`NEXT_PUBLIC_` プレフィックスが重要）
- 開発サーバーを再起動したか確認

### ドメインエラーが発生する場合

- Google reCAPTCHA Admin Consoleで `localhost` がドメインリストに追加されているか確認
- ブラウザのキャッシュをクリアしてみる

### フォームが送信できない場合

- ブラウザのコンソールでエラーを確認
- サーバーのログを確認
- `RECAPTCHA_SECRET_KEY` が正しく設定されているか確認

## 注意事項

- `.env.local` ファイルは `.gitignore` に含まれているため、Gitにはコミットされません
- 本番環境では、必ず両方のキーを設定してください
- 開発環境では、`RECAPTCHA_SECRET_KEY` が設定されていない場合、検証がスキップされます（開発用）
