import AsyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// async Handler :  handling exceptions inside of
// async express routes and passing them to your express error handlers.

// @desc     Fetch all products.
// @route     GET  /api/products
// @access     Public
const getProducts = AsyncHandler(async (req, res) => {
   const pageSize = 8
   const page = Number(req.query.pageNumber) || 1

   // with $regex the search is better,
   // you can search even letter or 2
   const keyword = req.query.keyword
      ? {
           name: {
              $regex: req.query.keyword,
              $options: 'i'
           }
        }
      : {}

   const count = await Product.countDocuments({ ...keyword })
   const products = await Product.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

   //products.reverse()
   res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc     Fetch all products for admin list.
// @route     GET  /api/products/admin
// @access     Public
const getProductsForAdmin = AsyncHandler(async (req, res) => {
   const products = await Product.find({}).sort({ createdAt: -1 })
   res.json({ products })
})

// @desc     Fetch all products.
// @route     GET  /api/products
// @access     Public
// const getProducts = AsyncHandler(async (req, res) => {
//    const products = await Product.find({})
//    products.reverse()
//    res.json({ products })
//    // const pageSize = 4
//    // const page = Number(req.query.pageNumber) || 1

//    // const keyword = req.query.keyword
//    //    ? {
//    //         name: {
//    //            $regex: req.query.keyword,
//    //            $options: 'i'
//    //         }
//    //      }
//    //    : {}

//    // const count = await Product.countDocuments({ ...keyword })
//    // const products = await Product.find({ ...keyword })
//    //    .limit(pageSize)
//    //    .skip(pageSize * (page - 1))
//    // res.json({ products, page, pages: Math.ceil(count / pageSize) })
//    //res.json({ products })
// })

// @desc     Fetch single product
// @route     GET  /api/products/:id
// @access     Public
const getProductById = AsyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id)
   if (product) {
      res.json(product)
   } else {
      res.status(404)
      throw new Error('Product not found')
   }
})

// @desc     Fetch single product
// @route     GET  /api/products/search/:keyword
// @access     Public
// const getProductsFromSearch = AsyncHandler(async (req, res) => {
//    const keyword = req.params.keyword
//       ? {
//            name: {
//               $regex: req.params.keyword,
//               $options: 'i'
//            }
//         }
//       : {}
//    console.log('keyword:!')
//    console.log(keyword)
//    const products = await Product.find({ ...keyword })
//    if (products) {
//       res.json({ products })
//    } else {
//       res.status(404)
//       throw new Error('Product not found')
//    }
// })

// @desc     Delete a product
// @route     DELETE  /api/products/:id
// @access     Private/Admin
const deleteProduct = AsyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id)
   if (product) {
      await product.remove()
      res.json({ message: 'Product Removed!' })
   } else {
      res.status(404)
      throw new Error('Product not found')
   }
})

// @desc     Create a product
// @route     POST  /api/products
// @access     Private/Admin
const createProduct = AsyncHandler(async (req, res) => {
   const product = new Product({
      name: 'Sample Name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'sample brand',
      countInStock: 0,
      description: 'Sample Description'
   })

   const createdProduct = await product.save()
   res.status(201).json(createdProduct)
})

// @desc     Update a product
// @route     PUT  /api/products/:id
// @access     Private/Admin
const updateProduct = AsyncHandler(async (req, res) => {
   const { name, price, brand, countInStock, description } = req.body
   const product = await Product.findById(req.params.id)

   if (product) {
      product.name = name
      product.price = price
      product.description = description
      //product.image = image
      product.brand = brand
      product.countInStock = countInStock

      const updatedProduct = await product.save()
      res.json(updatedProduct)
   } else {
      res.status(404)
      throw new Error('Product not found')
   }
})

// @desc     Create new review
// @route     POST  /api/products/:id/reviews
// @access     Private
const createProductReview = AsyncHandler(async (req, res) => {
   const { rating, comment } = req.body

   const product = await Product.findById(req.params.id)

   if (product) {
      const alreadyReviewed = product.reviews.find(
         (r) => r.user.toString() === req.user._id.toString()
      )
      if (alreadyReviewed) {
         res.status(400)
         throw new Error('Product Already Reviewed')
      }
      const review = {
         name: req.user.name,
         rating: Number(rating),
         comment,
         user: req.user._id
      }
      product.reviews.push(review)
      product.numReviews = product.reviews.length
      product.rating =
         product.reviews.reduce((acc, item) => item.rating + acc, 0) /
         product.reviews.length

      await product.save()
      res.status(201).json({ message: 'Review added' })
   } else {
      res.status(404)
      throw new Error('Product not found')
   }
})

// @desc     Get top rated products
// @route     GET  /api/products/top
// @access     Public
const getTopProducts = AsyncHandler(async (req, res) => {
   const products = await Product.find({}).sort({ rating: -1 }).limit(3)

   res.json(products)
})

export {
   getProducts,
   getProductsForAdmin,
   getProductById,
   deleteProduct,
   createProduct,
   updateProduct,
   createProductReview,
   getTopProducts
}
