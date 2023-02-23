import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import AsyncHandler from 'express-async-handler'

const protect = AsyncHandler(async (req, res, next) => {
   let token
   // check that there is a token
   // and the user logged in

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      try {
         // take the token without the
         // "bearer" in beginning

         token = req.headers.authorization.split(' ')[1]

         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         console.log(decoded)
         req.user = await User.findById(decoded.id).select('-password')
         next()
      } catch (error) {
         console.log(error)
         res.status(401)
         throw new Error('Token Failed!')
      }
   }

   if (!token) {
      res.status(401)
      throw new Error('No Token!')
   }
})

const admin = (req, res, next) => {
   if (req.user && req.user.isAdmin) {
      next()
   } else {
      res.status(401)
      throw new Error('Not Admin - Not Authorized ')
   }
}

export { protect, admin }
