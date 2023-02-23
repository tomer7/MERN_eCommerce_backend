import express from 'express'
import {
   authUser,
   registerUser,
   getUserProfile,
   updateUserProfile,
   getUsers,
   deleteUser,
   getUserById,
   updateUser,
   AddToCartArray,
   deleteItemFromCart,
   CleanTheCart,
   addAddress
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/login').post(authUser)
router
   .route('/profile-edit')
   .get(protect, getUserProfile)
   .put(protect, updateUserProfile)
router
   .route('/:id')
   .delete(protect, admin, deleteUser)
   .get(protect, admin, getUserById)
   .put(protect, admin, updateUser)
router.route('/addtocart').post(protect, AddToCartArray)
router.route('/deletefromcart/:id').delete(protect, deleteItemFromCart)
router.route('/cleanthecart').post(protect, CleanTheCart)
router.route('/add_address').post(protect, addAddress)

export default router
