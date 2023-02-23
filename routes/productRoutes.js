import express from 'express'
import {
   getProducts,
   getProductsForAdmin,
   getProductById,
   deleteProduct,
   updateProduct,
   createProduct,
   createProductReview,
   getTopProducts
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/admin').get(getProductsForAdmin)
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/top').get(getTopProducts)
router
   .route('/:id')
   .get(getProductById)
   .delete(protect, admin, deleteProduct)
   .put(protect, admin, updateProduct)

export default router
