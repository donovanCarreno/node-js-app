const Product = require('../models/product-mg')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
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
        product
      })
  })
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDescription = req.body.description

  Product
    .findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = updatedTitle
      product.price = updatedPrice
      product.description = updatedDescription
      product.imageUrl = updatedImageUrl

      return product
        .save()
        .then(result => {
          console.log('Updated Product')
          res.redirect('/admin/products')
        })
    })
    .catch(e => console.log({e}))    
}

exports.getProducts = (req, res, next) => {
  Product
    .find({userId: req.user._id})
    // .populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
    })
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product
    // .findByIdAndRemove(prodId)
    .deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('Destroyed Product')
      res.redirect('/admin/products')
    })
    .catch(e => console.log({e}))
}
