const Product = require('../models/product-mg')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.isAuthenticated
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, imageUrl, price, description} = req.body
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  })
  product
    .save()
    .then(result => {
      console.log('Product Created')
      res.redirect('/admin/products')
    })
    .catch(e => console.log({e}))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) {
    return res.redirect('/')
  }

  const prodId = req.params.productId

  Product
    .findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        isAuthenticated: req.isAuthenticated
      })
  })
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDescription = req.body.description
  
  const product = new Product({
    updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId
  })

  Product
    .findById(prodId)
    .then(product => {
      product.title = updatedTitle
      product.price = updatedPrice
      product.description = updatedDescription
      product.imageUrl = updatedImageUrl

      return product.save()
    })
    .then(result => {
      console.log('Updated Product')
      res.redirect('/admin/products')
    })
    .catch(e => console.log({e}))    
}

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.isAuthenticated
    })
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product
    .findByIdAndRemove(prodId)
    .then(() => {
      console.log('Destroyed Product')
      res.redirect('/admin/products')
    })
    .catch(e => console.log({e}))
}
