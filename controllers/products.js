const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
  // pug
  // res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product'})

  // hbs
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    // hbs
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    })
  })
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
  // pug
  // res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'})
}
