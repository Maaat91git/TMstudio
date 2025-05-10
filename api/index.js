const express = require('express');
const app = express();
const path = require('path');

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

// ルートの設定
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'ホーム',
    cart: [],
    getCartCount: (cart) => cart.reduce((total, item) => total + item.quantity, 0)
  });
});

// カテゴリーページのルート
app.get('/category/:category', (req, res) => {
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
});

// カートページのルート
app.get('/cart', (req, res) => {
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
});

// APIエンドポイント
app.post('/api/cart/remove', express.json(), (req, res) => {
  // カートから商品を削除する処理
  res.json({ success: true });
});

// Vercel用のエクスポート
module.exports = app; 