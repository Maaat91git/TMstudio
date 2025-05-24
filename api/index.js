const express = require('express');
const app = express();
const path = require('path');

// エラーハンドリング用のミドルウェア
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error: ' + err.message);
});

// リクエストボディのパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

// デバッグ用のミドルウェア
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ルートの設定
app.get('/', (req, res, next) => {
  try {
    // 新着商品のサンプルデータ
    const newProducts = [
      {
        id: 1,
        name: 'New Product 1',
        jaName: '新商品1',
        price: 15000,
        image: 'https://placehold.co/400x400/f5f5f5/333?text=New+Product+1',
        isNew: true,
        limited: false,
        colors: '3',
        category: 'LIGHT'
      },
      {
        id: 2,
        name: 'New Product 2',
        jaName: '新商品2',
        price: 20000,
        image: 'https://placehold.co/400x400/f5f5f5/333?text=New+Product+2',
        isNew: true,
        limited: true,
        colors: '2',
        category: 'ACCESSORY'
      }
    ];

    res.render('index', { 
      title: 'ホーム',
      cart: [],
      newProducts: newProducts,
      getCartCount: (cart) => cart.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    console.error('Error rendering index:', error);
    next(error);
  }
});

// カテゴリーページのルート
app.get('/category/:category', (req, res, next) => {
  try {
    const category = req.params.category.toUpperCase();
    
    // 仮の商品データ
    const products = [
      {
        id: 1,
        name: 'Sample Product',
        jaName: 'サンプル商品',
        price: 10000,
        image: 'https://placehold.co/400x400/f5f5f5/333?text=Product',
        isNew: true,
        limited: false,
        colors: '3',
        category: 'LIGHT'
      }
    ];
    
    res.render('category', { 
      title: category,
      category: category,
      products: products,
      cart: [],
      getCartCount: (cart) => cart.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    console.error('Error rendering category:', error);
    next(error);
  }
});

// カートページのルート
app.get('/cart', (req, res, next) => {
  try {
    // 仮のカートデータ
    const cart = [];
    const cartTotal = 0;
    
    // カート内の商品数を取得する関数
    const getCartCount = (cart) => {
      return cart.reduce((total, item) => total + item.quantity, 0);
    };
    
    res.render('cart', { 
      title: 'カート',
      cart: cart,
      cartTotal: cartTotal,
      getCartCount: getCartCount
    });
  } catch (error) {
    console.error('Error rendering cart:', error);
    next(error);
  }
});

// APIエンドポイント
app.post('/api/cart/remove', express.json(), (req, res, next) => {
  try {
    // カートから商品を削除する処理
    res.json({ success: true });
  } catch (error) {
    console.error('Error in cart remove:', error);
    next(error);
  }
});

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Vercel用のエクスポート
module.exports = app; 