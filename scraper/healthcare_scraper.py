#!/usr/bin/env python3
"""
Healthcare Price Scraper and Database Manager
模擬Webページから料金データをスクレイピングし、PostgreSQLデータベースに保存・検索するスクリプト
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import re
import os
from pathlib import Path
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import argparse
from urllib.parse import urlparse


class HealthcareScraper:
    def __init__(self, db_url: str = None, **db_params):
        """
        初期化
        
        Args:
            db_url: PostgreSQL接続URL (例: postgresql://user:password@localhost:5432/dbname)
            db_params: 個別の接続パラメータ (host, port, database, user, password)
        """
        if db_url:
            self.db_url = db_url
        else:
            # デフォルトの接続パラメータ
            self.db_params = {
                'host': db_params.get('host', 'localhost'),
                'port': db_params.get('port', 5432),
                'database': db_params.get('database', 'healthcare_prices'),
                'user': db_params.get('user', 'postgres'),
                'password': db_params.get('password', 'postgres')
            }
            self.db_url = None
        self.init_database()
    
    def get_connection(self):
        """PostgreSQL接続を取得"""
        if self.db_url:
            return psycopg2.connect(self.db_url)
        else:
            return psycopg2.connect(**self.db_params)
    
    def init_database(self):
        """データベースとテーブルを初期化"""
        try:
            conn = self.get_connection()
            conn.autocommit = True
            cursor = conn.cursor()
            
            # プロバイダーテーブル
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS providers (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    location VARCHAR(255),
                    rating DECIMAL(3, 2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # サービス料金テーブル
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS services (
                    id SERIAL PRIMARY KEY,
                    provider_id INTEGER NOT NULL,
                    service_name VARCHAR(255) NOT NULL,
                    price INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
                )
            ''')
            
            # インデックスを作成（検索を高速化）
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_service_name ON services(service_name)
            ''')
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_provider_id ON services(provider_id)
            ''')
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_location ON providers(location)
            ''')
            
            conn.close()
            db_name = self.db_params.get('database', 'healthcare_prices') if not self.db_url else urlparse(self.db_url).path[1:]
            print(f"✓ PostgreSQLデータベース '{db_name}' を初期化しました")
        except psycopg2.Error as e:
            print(f"❌ データベース接続エラー: {e}")
            print("\n接続情報を確認してください:")
            print("  - データベースが作成されているか")
            print("  - 接続情報（ホスト、ポート、ユーザー名、パスワード）が正しいか")
            print("  - PostgreSQLサーバーが起動しているか")
            raise
    
    def parse_price(self, price_str: str) -> int:
        """
        価格文字列を整数に変換
        
        Args:
            price_str: "¥50,000" のような価格文字列
            
        Returns:
            価格の整数値
        """
        # カンマと通貨記号を除去
        price_clean = re.sub(r'[¥,\s]', '', price_str)
        try:
            return int(price_clean)
        except ValueError:
            return 0
    
    def scrape_html(self, html_path: str) -> List[Dict]:
        """
        HTMLファイルから料金データをスクレイピング
        
        Args:
            html_path: HTMLファイルのパス
            
        Returns:
            スクレイピングしたデータのリスト
        """
        print(f"\n📄 HTMLファイルを読み込み中: {html_path}")
        
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, 'html.parser')
        providers = soup.find_all('div', class_='provider')
        
        scraped_data = []
        
        for provider in providers:
            provider_name = provider.find('div', class_='provider-name').text.strip()
            location_elem = provider.find('div', class_='location')
            location = location_elem.text.replace('Location: ', '').strip() if location_elem else ''
            
            rating_elem = provider.find('div', class_='rating')
            rating_str = rating_elem.text.replace('Rating: ', '').replace('/5', '').strip() if rating_elem else '0'
            rating = float(rating_str) if rating_str else 0.0
            
            services = provider.find_all('div', class_='service')
            service_list = []
            
            for service in services:
                service_name = service.find('span', class_='service-name').text.strip()
                price_elem = service.find('span', class_='price')
                price_str = price_elem.text.strip() if price_elem else '¥0'
                price = self.parse_price(price_str)
                
                service_list.append({
                    'service_name': service_name,
                    'price': price
                })
            
            scraped_data.append({
                'provider_name': provider_name,
                'location': location,
                'rating': rating,
                'services': service_list
            })
        
        print(f"✓ {len(scraped_data)} 件のプロバイダーと {sum(len(p['services']) for p in scraped_data)} 件のサービスを取得しました")
        return scraped_data
    
    def save_to_database(self, data: List[Dict], clear_existing: bool = False):
        """
        スクレイピングしたデータをデータベースに保存
        
        Args:
            data: スクレイピングしたデータ
            clear_existing: 既存データを削除するかどうか
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if clear_existing:
                cursor.execute('DELETE FROM services')
                cursor.execute('DELETE FROM providers')
                print("✓ 既存データを削除しました")
            
            for provider_data in data:
                # プロバイダーを挿入
                cursor.execute('''
                    INSERT INTO providers (name, location, rating)
                    VALUES (%s, %s, %s)
                    RETURNING id
                ''', (provider_data['provider_name'], provider_data['location'], provider_data['rating']))
                
                provider_id = cursor.fetchone()[0]
                
                # サービスを挿入
                for service in provider_data['services']:
                    cursor.execute('''
                        INSERT INTO services (provider_id, service_name, price)
                        VALUES (%s, %s, %s)
                    ''', (provider_id, service['service_name'], service['price']))
            
            conn.commit()
            print(f"✓ データベースに保存しました")
        except psycopg2.Error as e:
            conn.rollback()
            print(f"❌ データベース保存エラー: {e}")
            raise
        finally:
            conn.close()
    
    def search_services(self, service_name: Optional[str] = None, 
                       location: Optional[str] = None,
                       max_price: Optional[int] = None,
                       min_rating: Optional[float] = None) -> List[Dict]:
        """
        サービスを検索
        
        Args:
            service_name: サービス名（部分一致）
            location: 場所（部分一致）
            max_price: 最大価格
            min_rating: 最小評価
            
        Returns:
            検索結果のリスト
        """
        conn = self.get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = '''
            SELECT 
                p.id AS provider_id,
                p.name AS provider_name,
                p.location,
                p.rating,
                s.service_name,
                s.price
            FROM services s
            JOIN providers p ON s.provider_id = p.id
            WHERE 1=1
        '''
        params = []
        
        if service_name:
            query += ' AND s.service_name ILIKE %s'
            params.append(f'%{service_name}%')
        
        if location:
            query += ' AND p.location ILIKE %s'
            params.append(f'%{location}%')
        
        if max_price:
            query += ' AND s.price <= %s'
            params.append(max_price)
        
        if min_rating:
            query += ' AND p.rating >= %s'
            params.append(min_rating)
        
        query += ' ORDER BY s.price ASC'
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        conn.close()
        
        # 結果を辞書形式に変換
        search_results = []
        for row in results:
            search_results.append(dict(row))
        
        return search_results
    
    def display_results(self, results: List[Dict]):
        """検索結果を表示"""
        if not results:
            print("\n❌ 検索結果が見つかりませんでした")
            return
        
        print(f"\n📊 検索結果: {len(results)} 件")
        print("=" * 80)
        
        for result in results:
            print(f"\n🏥 {result['provider_name']}")
            print(f"   📍 場所: {result['location']}")
            print(f"   ⭐ 評価: {result['rating']}/5")
            print(f"   💰 サービス: {result['service_name']}")
            print(f"   💵 価格: ¥{result['price']:,}")
            print("-" * 80)
    
    def get_statistics(self):
        """データベースの統計情報を取得"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM providers')
        provider_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM services')
        service_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(price) FROM services')
        avg_price = cursor.fetchone()[0]
        avg_price = int(avg_price) if avg_price else 0
        
        cursor.execute('SELECT MIN(price), MAX(price) FROM services')
        min_max = cursor.fetchone()
        min_price = min_max[0] or 0
        max_price = min_max[1] or 0
        
        conn.close()
        
        print("\n📈 データベース統計")
        print("=" * 80)
        print(f"プロバイダー数: {provider_count}")
        print(f"サービス数: {service_count}")
        print(f"平均価格: ¥{avg_price:,}")
        print(f"最低価格: ¥{min_price:,}")
        print(f"最高価格: ¥{max_price:,}")


def main():
    parser = argparse.ArgumentParser(description='Healthcare Price Scraper and Database Manager (PostgreSQL)')
    
    # データベース接続オプション
    db_group = parser.add_argument_group('データベース接続')
    db_group.add_argument('--db-url', 
                         help='PostgreSQL接続URL (例: postgresql://user:password@localhost:5432/dbname)')
    db_group.add_argument('--host', default='localhost', help='PostgreSQLホスト')
    db_group.add_argument('--port', type=int, default=5432, help='PostgreSQLポート')
    db_group.add_argument('--database', default='healthcare_prices', help='データベース名')
    db_group.add_argument('--user', default='postgres', help='ユーザー名')
    db_group.add_argument('--password', help='パスワード（環境変数PGPASSWORDも使用可能）')
    
    subparsers = parser.add_subparsers(dest='command', help='実行するコマンド')
    
    # スクレイピングコマンド
    scrape_parser = subparsers.add_parser('scrape', help='HTMLからデータをスクレイピングして保存')
    scrape_parser.add_argument('--html', default='mock_healthcare_prices.html', 
                              help='HTMLファイルのパス')
    scrape_parser.add_argument('--clear', action='store_true',
                              help='既存データを削除してから保存')
    
    # 検索コマンド
    search_parser = subparsers.add_parser('search', help='データベースを検索')
    search_parser.add_argument('--service', help='サービス名で検索')
    search_parser.add_argument('--location', help='場所で検索')
    search_parser.add_argument('--max-price', type=int, help='最大価格')
    search_parser.add_argument('--min-rating', type=float, help='最小評価')
    
    # 統計コマンド
    stats_parser = subparsers.add_parser('stats', help='データベースの統計情報を表示')
    
    args = parser.parse_args()
    
    # データベース接続パラメータを準備
    if args.db_url:
        scraper = HealthcareScraper(db_url=args.db_url)
    else:
        # 環境変数からパスワードを取得（指定されていない場合）
        password = args.password or os.environ.get('PGPASSWORD', 'postgres')
        scraper = HealthcareScraper(
            host=args.host,
            port=args.port,
            database=args.database,
            user=args.user,
            password=password
        )
    
    # スクリプトのディレクトリを基準にパスを解決
    script_dir = Path(__file__).parent
    
    if args.command == 'scrape' or args.command is None:
        html_path = script_dir / (args.html if hasattr(args, 'html') else 'mock_healthcare_prices.html')
        clear_existing = args.clear if hasattr(args, 'clear') else False
        
        if not html_path.exists():
            print(f"❌ エラー: HTMLファイルが見つかりません: {html_path}")
            return
        
        data = scraper.scrape_html(str(html_path))
        scraper.save_to_database(data, clear_existing=clear_existing)
        scraper.get_statistics()
    
    elif args.command == 'search':
        results = scraper.search_services(
            service_name=args.service,
            location=args.location,
            max_price=args.max_price,
            min_rating=args.min_rating
        )
        scraper.display_results(results)
    
    elif args.command == 'stats':
        scraper.get_statistics()


if __name__ == '__main__':
    main()

