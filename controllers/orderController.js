import AsyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// async Handler :  handling exceptions inside of
// async express routes and passing them to your express error handlers.

// @desc     Create new order.
// @route     POST  /api/orders
// @access     Private
const addOrderItems = AsyncHandler(async (req, res) => {
   const { orderItems, shippingAddress, totalPrice } = req.body

   if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('No order items')
      return
   } else {
      const order = new Order({
         orderItems,
         user: req.user._id,
         shippingAddress,
         totalPrice
      })
      const createdOrder = await order.save()
      res.status(201).json(createdOrder)
   }
})

// @desc     Get order by ID.
// @route     GET  /api/orders/:id
// @access     Private
const getOrderByID = AsyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).populate(
      'user',
      'name email isAdmin'
   )
   // const order = await Order.findById(req.params.id)
   // console.log(order)

   if (order) {
      res.json(order)
   } else {
      res.status(404)
      throw new Error('Order Not Found')
   }
})

// @desc     Update order to paid.
// @route     PUT  /api/orders/:id/pay
// @access     Private
const updateOrderToPaid = AsyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id)

   if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
         id: req.body.id,
         status: req.body.status,
         update_time: req.body.update_time,
         email_address: req.body.payer.email_address
      }

      const updatedOrder = await order.save()
      res.json(updatedOrder)
   } else {
      res.status(404)
      throw new Error('Order Not Found')
   }
})

// @desc     Update order to delivered.
// @route     PUT  /api/orders/:id/deliver
// @access     Private/Admin
const updateOrderToDelivered = AsyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id)

   if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()

      const updatedOrder = await order.save()
      res.json(updatedOrder)
   } else {
      res.status(404)
      throw new Error('Order Not Found')
   }
})

// @desc     Get list of orders in profile page.
// @route     GET  /api/orders/myorders
// @access     Private
const getMyOrders = AsyncHandler(async (req, res) => {
   const orders = await Order.find({ user: req.user._id })
   res.json(orders)
})

// @desc     Get all orders.
// @route     GET  /api/orders
// @access     Private/Admin
const getOrders = AsyncHandler(async (req, res) => {
   const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
   res.json(orders)
})

export {
   addOrderItems,
   getOrderByID,
   updateOrderToPaid,
   updateOrderToDelivered,
   getMyOrders,
   getOrders
}
