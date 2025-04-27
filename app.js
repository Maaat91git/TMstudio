const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const products = require('./data/products');

// セッションの設定
app.use(session({
    secret: 'tanacchi-kobo-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 開発環境ではfalse
}));

// POSTデータのパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 商品画像のパスを修正
products.forEach(product => {
    if (product.id === 1) {
        product.image = '/images/DSC02367.jpg';
    } else if (product.id === 2) {
        product.image = '/images/DSC00283.jpg';
    } else if (product.id === 4) {
        product.image = '/images/keyholder.png';
    } else if (product.id === 5) {
        product.image = '/images/ApparelTOP.png';
    } else if (product.id === 6) {
        product.image = '/images/ハンカチTOP.png';
    } else if (product.id === 9) {
        product.image = '/images/SteckerTOP.png';
    } else {
        product.image = 'https://placehold.co/600x400/f5f5f5/333?text=NoImage';
    }
});

// テンプレートエンジンの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイルの設定
app.use(express.static(path.join(__dirname, 'public')));

// カートの初期化ミドルウェア
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// カートの合計数を計算するヘルパー関数
app.locals.getCartCount = (cart) => {
    return cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
};

// ルーティング
app.get('/', (req, res) => {
    const newProducts = products.filter(product => product.isNew);
    res.render('index', { 
        title: 'ホーム',
        products: products,
        newProducts: newProducts,
        cart: req.session.cart
    });
});

// カート関連のAPI
app.post('/api/cart/add', (req, res) => {
    const { productId, quantity, color } = req.body;
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        return res.status(404).json({ error: '商品が見つかりません' });
    }

    const cartItem = {
        id: product.id,
        name: product.name,
        jaName: product.jaName,
        price: product.price,
        quantity: parseInt(quantity),
        color: color
    };

    const existingItemIndex = req.session.cart.findIndex(
        item => item.id === cartItem.id && item.color === cartItem.color
    );

    if (existingItemIndex > -1) {
        req.session.cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        req.session.cart.push(cartItem);
    }

    res.json({ 
        success: true, 
        message: 'カートに追加しました',
        cartCount: app.locals.getCartCount(req.session.cart)
    });
});

// カート表示ページ
app.get('/cart', (req, res) => {
    const cartTotal = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('cart', {
        title: 'カート',
        cart: req.session.cart,
        cartTotal: cartTotal
    });
});

// カート内商品の削除
app.post('/api/cart/remove', (req, res) => {
    const { index } = req.body;
    req.session.cart.splice(index, 1);
    res.json({ 
        success: true, 
        message: '商品を削除しました',
        cartCount: app.locals.getCartCount(req.session.cart)
    });
});

// すべての商品一覧ページ
app.get('/category/all', (req, res) => {
    res.render('category', { 
        title: 'ALL PRODUCTS',
        category: 'ALL PRODUCTS',
        products: products,
        cart: req.session.cart
    });
});

// カテゴリー別商品一覧ページ
app.get('/category/:category', (req, res) => {
    const category = req.params.category.toUpperCase();
    const categoryProducts = products.filter(product => product.category === category);
    
    if (categoryProducts.length === 0) {
        return res.status(404).render('error', { 
            title: '404 Not Found',
            message: 'カテゴリーが見つかりませんでした',
            cart: req.session.cart
        });
    }
    
    res.render('category', { 
        title: category,
        category: category,
        products: categoryProducts,
        cart: req.session.cart
    });
});

// 商品詳細ページ
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).render('error', { 
            title: '404 Not Found',
            message: '商品が見つかりませんでした',
            cart: req.session.cart
        });
    }
    
    res.render('product', { 
        title: product.name,
        product: product,
        cart: req.session.cart
    });
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
}); 