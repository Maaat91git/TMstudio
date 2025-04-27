# モダンウェブサイト

Node.jsとExpress.jsを使用したモダンなウェブサイトのサンプルプロジェクトです。

## 機能

- レスポンシブデザイン
- Bootstrap 5によるモダンなUI
- EJSテンプレートエンジン
- シンプルなルーティング

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで以下のURLにアクセス:
```
http://localhost:3000
```

## プロジェクト構造

```
├── app.js              # メインアプリケーションファイル
├── package.json        # プロジェクト設定と依存関係
├── public/             # 静的ファイル
│   └── css/
│       └── style.css   # カスタムスタイル
└── views/              # EJSテンプレート
    └── index.ejs       # メインページ
``` 