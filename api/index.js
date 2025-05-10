const express = require('express');
const app = express();
const path = require('path');

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));

// ルートの設定
app.get('/', (req, res) => {
  res.render('index', { title: 'ホーム' });
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