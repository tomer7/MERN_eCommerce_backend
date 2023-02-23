import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import findOrCreate from 'mongoose-findorcreate'

const userSchema = mongoose.Schema(
   {
      name: {
         type: String
      },
      email: {
         type: String
      },
      password: {
         type: String
      },
      country: {
         type: String
      },
      city: {
         type: String
      },
      street_and_house: {
         type: String
      },
      postalcode: {
         type: String
      },
      isAdmin: {
         type: Boolean,
         default: false
      },
      items_in_cart: [
         {
            idOfProduct: { type: String, required: true },
            qty: { type: Number, required: true },
            size: { type: Number, required: true },
            imageOfProduct: { type: Buffer, requird: true },
            nameOfProduct: { type: String, required: true },
            priceOfProduct: { type: Number, required: true }
         }
      ]
   },
   {
      timestamps: true
   }
)

userSchema.virtual('orders', {
   ref: 'Order',
   localField: '_id',
   foreignField: 'user'
})

userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      next()
   }

   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})

userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)

export default User
