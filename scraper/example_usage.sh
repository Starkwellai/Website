#!/bin/bash
# Healthcare Scraper 使用例

echo "=== Healthcare Price Scraper 使用例 ==="
echo ""

echo "1. データのスクレイピングと保存（既存データを削除）"
python3 healthcare_scraper.py scrape --clear
echo ""

echo "2. 統計情報の表示"
python3 healthcare_scraper.py stats
echo ""

echo "3. サービス名で検索: Colonoscopy"
python3 healthcare_scraper.py search --service "Colonoscopy"
echo ""

echo "4. 場所と最大価格で検索: Tokyo, 最大50,000円"
python3 healthcare_scraper.py search --location "Tokyo" --max-price 50000
echo ""

echo "5. 最小評価で検索: 4.5以上"
python3 healthcare_scraper.py search --min-rating 4.5
echo ""

echo "6. 複数条件で検索: Dental, Tokyo, 最大5,000円"
python3 healthcare_scraper.py search --service "Dental" --location "Tokyo" --max-price 5000
echo ""

echo "=== 完了 ==="

