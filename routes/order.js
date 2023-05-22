// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

// DEPENDENCIES
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');

// IMPORT MODELS
const User = require('../models/user');
const Product = require('../models/product');
const { Order, Cart } = require('../models/order');


//Session middleware
router.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// Order

router.post('/checkout', async (req, res) => {
    const {address, hub} = req.body;

    try {
      const cart = await Cart.findOneAndDelete({ customerAddress: address });
      if (!cart) {
        return res.status(404).send();
      };

      const shippers = await User.find({ hubNameAndAddress: hub });
      console.log(shippers);
      if (!shippers.length) {
        return res.status(404).send('No shippers found');
      };

      const randomShipper = shippers[Math.floor(Math.random() * shippers.length)];
      console.log(randomShipper);

      const newOrder = new Order({
        products: cart.products,
        totalPrice: cart.totalPrice, 
        customerAddress: cart.customerAddress,
        shipperId: randomShipper._id,
      });

      console.log(newOrder, newOrder.shipperId);
      newOrder.save();
      console.log('Order added')

      res.status(200).send('Order placed')
      
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
})

// Order details 
router.get('/order/detail', async (req, res) => {
  const user = req.session.user;
  const  orderId  = req.query.order;
  console.log(user, orderId);

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order does not exist');
    }

    res.render(`./product/order`, { user, order });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// Set Status to remove order
router.post('/order/remove', async (req, res) => {
    console.log(req.body, req.query, req.session);
    const { orderId, status } = req.body;

    try {
        if (status === 'delivered' || 'cancelled') {
            await Order.findOneAndDelete({_id : orderId});
        }
        res.status(200).send('Update sucessfully');
    } catch(error) {
        console.error(error);
        res.status(500).send();
    }
})
module.exports = router;