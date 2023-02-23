import express from 'express'
import passport from 'passport'
// import { authUserFromGoogle } from '../controllers/userController.js'
var router = express.Router()

router.get('/login/success', (req, res) => {
   if (req.user) {
      res.status(200).json({
         success: true,
         message: 'succesful',
         user: req.user
         //  cookies: req.cookies
         // or JWT here
      })
   }
})

router.get('/login/failed', (req, res) => {
   res.status(401).json({
      success: false,
      message: 'failure'
   })
})

router.get('/logout', (req, res) => {
   req.logout()
   res.redirect('http://localhost:3000')
})

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get(
   '/google/callback',
   passport.authenticate('google', {
      successRedirect: 'http://localhost:3000',
      failureRedirect: '/login/failed'
   })
)

router.get('/github', passport.authenticate('github', { scope: ['profile'] }))

router.get(
   '/github/callback',
   passport.authenticate('github', {
      successRedirect: 'http://localhost:3000',
      failureRedirect: '/login/failed'
   })
)

export default router
