# Healthcare Price Scraper

模擬Webページから料金データをスクレイピングし、PostgreSQLデータベースに保存・検索するPythonスクリプトです。

## セットアップ

### 1. PostgreSQLのインストールとセットアップ

```bash
# PostgreSQL 18をインストール（macOS）
brew install postgresql@18

# PostgreSQLを起動
brew services start postgresql@18

# データベースを作成
createdb healthcare_prices
```

### 2. Python環境のセットアップ

```bash
# 仮想環境を作成（推奨）
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存パッケージをインストール
pip install -r requirements.txt
```

### 3. 環境変数の設定（オプション）

```bash
# パスワードを環境変数に設定（推奨）
export PGPASSWORD=your_password
```

## 使用方法

### 1. データのスクレイピングと保存

```bash
# 基本的な使用方法（デフォルト接続情報を使用）
python healthcare_scraper.py scrape

# 接続URLを指定
python healthcare_scraper.py --db-url "postgresql://user:password@localhost:5432/healthcare_prices" scrape

# 個別の接続パラメータを指定
python healthcare_scraper.py --host localhost --port 5432 --database healthcare_prices --user postgres scrape

# 既存データを削除してから保存
python healthcare_scraper.py scrape --clear

# カスタムHTMLファイルを指定
python healthcare_scraper.py scrape --html custom_prices.html
```

### 2. データベースの検索

```bash
# サービス名で検索
python healthcare_scraper.py search --service "Colonoscopy"

# 接続情報を指定して検索
python healthcare_scraper.py --db-url "postgresql://user:password@localhost:5432/healthcare_prices" search --service "Colonoscopy"

# 場所で検索
python healthcare_scraper.py search --location "Tokyo"

# 最大価格を指定
python healthcare_scraper.py search --service "Knee Repair" --max-price 800000

# 最小評価を指定
python healthcare_scraper.py search --min-rating 4.5

# 複数条件で検索
python healthcare_scraper.py search --service "Dental" --location "Tokyo" --max-price 5000
```

### 3. 統計情報の表示

```bash
python healthcare_scraper.py stats
```

## データベース構造

### providers テーブル
- `id`: プロバイダーID（SERIAL主キー）
- `name`: プロバイダー名（VARCHAR(255)）
- `location`: 場所（VARCHAR(255)）
- `rating`: 評価（DECIMAL(3, 2)）
- `created_at`: 作成日時（TIMESTAMP）

### services テーブル
- `id`: サービスID（SERIAL主キー）
- `provider_id`: プロバイダーID（外部キー、CASCADE削除）
- `service_name`: サービス名（VARCHAR(255)）
- `price`: 価格（INTEGER）
- `created_at`: 作成日時（TIMESTAMP）

### インデックス
- `idx_service_name`: サービス名検索用
- `idx_provider_id`: プロバイダーID検索用
- `idx_location`: 場所検索用

## 例

```bash
# 1. データをスクレイピングして保存
python healthcare_scraper.py scrape --clear

# 2. 統計情報を確認
python healthcare_scraper.py stats

# 3. 大腸内視鏡検査を検索
python healthcare_scraper.py search --service "Colonoscopy"

# 4. 東京の5,000円以下のサービスを検索
python healthcare_scraper.py search --location "Tokyo" --max-price 5000
```

## 接続方法

### 方法1: 接続URLを使用（推奨）

```bash
python healthcare_scraper.py --db-url "postgresql://user:password@localhost:5432/healthcare_prices" scrape
```

### 方法2: 個別パラメータを使用

```bash
python healthcare_scraper.py --host localhost --port 5432 --database healthcare_prices --user postgres --password your_password scrape
```

### 方法3: 環境変数を使用

```bash
export PGPASSWORD=your_password
python healthcare_scraper.py --host localhost --database healthcare_prices --user postgres scrape
```

## 注意事項

- HTMLファイルはUTF-8エンコーディングで保存してください
- PostgreSQL 18がインストールされ、起動している必要があります
- データベースが事前に作成されている必要があります（`createdb healthcare_prices`）
- `--clear`オプションを使用すると既存のデータが削除されます
- パスワードは環境変数`PGPASSWORD`で設定することも可能です（セキュリティのため推奨）

