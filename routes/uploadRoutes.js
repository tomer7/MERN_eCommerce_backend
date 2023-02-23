import path from 'path'
import express from 'express'
import multer from 'multer'
import { protect, admin } from '../middleware/authMiddleware.js'
import Product from '../models/productModel.js'

const router = express.Router()

const upload = multer({
   limits: {
      fileSize: 10000000000
   },
   fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
         return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
   }
})

router.post(
   '/:id',
   protect,
   admin,
   upload.single('image'),
   async (req, res) => {
      console.log('req - file - buffer')
      //const product = await Product.findById('63d3b9ad34ad4591b5a8c8e9')
      const product = await Product.findById(req.params.id)
      console.log(product)
      console.log('req.params.id')
      console.log(req.params.id)
      console.log('req - file - buffer')
      console.log(req.file.buffer)
      if (product) {
         product.image = req.file.buffer

         const updatedProduct = await product.save()
         res.json(updatedProduct)
      }
   },
   (error, req, res, next) => {
      res.status(400).send({ error: error.message })
   }
)

router.get('/products/:id/image', async (req, res) => {
   try {
      console.log(req.params.id)
      const product = await Product.findById(req.params.id)

      if (!product) {
         throw new Error()
      }

      res.set('Content-Type', 'image/png')
      res.send(product.image)
   } catch (error) {
      res.status(400).send()
   }
})

// // we want to initialize our storage engine
// const storage = multer.diskStorage({
//    destination(req, file, cb) {
//       cb(null, 'uploads/')
//    },
//    filename(req, file, cb) {
//       cb(
//          null,
//          `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//       )
//    }
// })

// function checkFileType(file, cb) {
//    const filetypes = /jpg|jpeg|png/
//    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//    const mimetype = filetypes.test(file.mimetype)

//    if (extname && mimetype) {
//       return cb(null, true)
//    } else {
//       cb('Images only!')
//    }
// }

// const upload = multer({
//    storage,
//    fileFilter: function (req, file, cb) {
//       checkFileType(file, cb)
//    }
// })

// router.post('/', upload.single('image'), (req, res) => {
//    res.send(`/${req.file.path}`)
// })

export default router
