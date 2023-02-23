import AsyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import dotenv from 'dotenv'
dotenv.config()

// @desc     Auth user & get token.
// @route     POST  /api/users/login
// @access     Public
const authUser = AsyncHandler(async (req, res) => {
   const { email, password } = req.body
   const user = await User.findOne({ email: email })
   if (user && (await user.matchPassword(password))) {
      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
         items_in_cart: user.items_in_cart,
         token: generateToken(user._id, user.email),
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
         country: user.country,
         city: user.city,
         street_and_house: user.street_and_house,
         postalcode: user.postalcode
      })
   } else {
      res.status(401)
      throw new Error('Invalid email or password')
   }
})

// @desc     Register a new user.
// @route     POST  /api/users
// @access     Public
const registerUser = AsyncHandler(async (req, res) => {
   const { name, email, password } = req.body

   const userExists = await User.findOne({ email: email })

   if (userExists) {
      res.status(400)
      throw new Error('User Already Exists')
   }

   const user = await User.create({
      name,
      email,
      password
   })

   if (user) {
      res.status(201).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
         token: generateToken(user._id, user.email)
      })
   } else {
      res.status(400)
      throw new Error('Invalid user data')
   }
})

// @desc     Get user profile
// @route     GET  /api/users/profile-edit
// @access     Private
const getUserProfile = AsyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id)
   //const user = req.user

   if (user) {
      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         items_in_cart: user.items_in_cart,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
         country: user.country,
         city: user.city,
         street_and_house: user.street_and_house,
         postalcode: user.postalcode
      })
   } else {
      res.status(404)
      throw new Error('User Not Found')
   }
})

// @desc     Update user profile
// @route     PUT  /api/users/profile-edit
// @access     Private
const updateUserProfile = AsyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id)
   //const user = req.user

   if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
         user.password = req.body.password || user.password
      }

      const updatedUser = await user.save()

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin,
         token: generateToken(updatedUser._id)
      })
   } else {
      res.status(404)
      throw new Error('User Not Found')
   }
})

// @desc     Get all users
// @route     GET  /api/users
// @access     Private/Admin
const getUsers = AsyncHandler(async (req, res) => {
   const users = await User.find({}).sort({ createdAt: -1 })
   res.json(users)
})

// @desc     Delete user
// @route     DELETE  /api/users/:id
// @access     Private/Admin
const deleteUser = AsyncHandler(async (req, res) => {
   const user = await User.findById(req.params.id)
   if (user) {
      await user.remove()
      res.json('User Removed!')
   } else {
      res.status(404)
      throw new Error('User Not Found')
   }
})

// @desc     Get user by id
// @route     GET  /api/users/:id
// @access     Private/Admin
const getUserById = AsyncHandler(async (req, res) => {
   const user = await User.findById(req.params.id).select('-password')
   if (user) {
      res.json(user)
   } else {
      res.status(404)
      throw new Error('User Not Found')
   }
})

// @desc     Update user - By Admin
// @route     PUT  /api/users/:id
// @access     Private/Admin
const updateUser = AsyncHandler(async (req, res) => {
   const user = await User.findById(req.params.id)

   if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      // if (req.body.password) {
      //    user.password = req.body.password || user.password
      // }
      user.isAdmin = req.body.isAdmin

      const updatedUser = await user.save()

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin
      })
   } else {
      res.status(404)
      throw new Error('User Not Found')
   }
})

// @desc       Add To Cart Array.
// @route      POST  /api/users/addtocart
// @access     Private
const AddToCartArray = AsyncHandler(async (req, res) => {
   //res.header('Access-Control-Allow-Origin', '*')
   const user = await User.findById(req.user._id)
   const {
      idOfProduct,
      qty,
      size,
      //imageOfProduct,
      nameOfProduct,
      priceOfProduct
   } = req.body

   user.items_in_cart.push({
      idOfProduct,
      qty,
      size,
      //imageOfProduct,
      nameOfProduct,
      priceOfProduct
   })
   user.save()
   res.status(200).json({
      message: 'Saved'
   })
})

// @desc       Delete From Cart Array.
// @route      DELETE  /api/users/deletefromcart/:id
// @access     Private
const deleteItemFromCart = AsyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id)

   user.items_in_cart.pull({ _id: req.params.id })
   user.save()
   res.status(200).json({ message: 'Work!' })
})

// @desc       Clean The Cart Array.
// @route      DELETE  /api/users/cleanthecart
// @access     Private
const CleanTheCart = AsyncHandler(async (req, res) => {
   const cleancart = await User.updateOne(
      { _id: req.user._id },
      { $set: { items_in_cart: [] } }
   )
   res.status(200).json({ message: 'Work!' })
})

// @desc       Add address to user.
// @route      POST  /api/users/add_address
// @access     Private
const addAddress = AsyncHandler(async (req, res) => {
   const update_country = await User.updateOne(
      { _id: req.user._id },
      { $set: { country: req.body.country } }
   )
   const update_city = await User.updateOne(
      { _id: req.user._id },
      { $set: { city: req.body.city } }
   )
   const update_str_hou = await User.updateOne(
      { _id: req.user._id },
      { $set: { street_and_house: req.body.streetandhousenumber } }
   )
   const update_postalcode = await User.updateOne(
      { _id: req.user._id },
      { $set: { postalcode: req.body.postalcode } }
   )
   console.log('after update')
   res.status(200).json({ message: 'AddressUpdate!' })
})

export {
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
}
