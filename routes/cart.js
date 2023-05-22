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

// RANDOM SHIPPER
async function randomShipper() {
  try {
    const shippers = await User.find({ role: 'shipper' });
    if (!shippers.length) {
      throw new Error('No shippers found');
    }

    // a random shipper
    const randomShipper = shippers[Math.floor(Math.random() * shippers.length)];

    return randomShipper;
  } catch (error) {
    throw new Error('Cannot get a shipper');
  }
}

// ROUTES
// ADD
router.post('/cart/add', async (req, res) => {
  let { productId, quantity } = req.body;
  quantity = parseInt(quantity);
  console.log(`add body:`, req.body);
  const user = req.session.user;
  console.log('cartProduct: ', productId);
  try {
    const product = await Product.findOne({ _id: productId });
    console.log('product match:', product);
    if (!product) {
      return res.status(404).send('Not found');
    }
    if (product.quantity < quantity) {
      return res.status(404).send(`
        <script>alert('Stock does not have enough item');
        windown.location.href('/'); </script>`);
    }

    const itemPrice = product.price * quantity;
    console.log('Subtotal: ', itemPrice);
    const cartItem = {
      product: product,
      itemPrice,
      quantity: parseInt(quantity),
    };
    console.log('products: ',cartItem);
    let cart = await Cart.findOne({
      customerAddress: req.session.user.address,
    });
    console.log(cart);
    if (cart) {
      
      cart.products.push(cartItem);
      cart.totalPrice += itemPrice;
    } else {
      cart = new Cart({
        products: [cartItem],
        totalPrice: itemPrice,
        customerAddress: req.session.user.address,
      });
    }
    console.log('Updated cart: ',cart);
    await cart.validate();
    await cart.save();

    await Product.findOneAndUpdate(
      { _id: product._id },
      { $inc: { quantity: -quantity } }, // increment by (-quantity) = decrement
      { upsert: true }
    );
    console.log(`
    <script>alert('Added to cart');
    windown.location.href('/'); </script>`);
    res.render('product/cart', { user, cart });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// REMOVE

router.post('/cart/remove', async (req, res) => {
  let { productId, itemPrice, quantity } = req.body;
  productId = new mongoose.Types.ObjectId(productId);
  console.log('productId:', productId);
  itemPrice = parseInt(itemPrice);
  quantity = parseInt(quantity);
  const user = req.session.user;
  console.log(productId, quantity);
  try {
    const cart = await Cart.findOne({ customerAddress: user.address });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    console.log('products:', cart.products);
    const updatedProducts = cart.products.filter(product => !product.product.equals(productId))
    console.log('updatedProducts: ', updatedProducts);
    cart.products = updatedProducts;
    cart.totalPrice -= parseFloat(itemPrice); // Default to 0

    console.log('updated cart remove: ', cart)
    await cart.save();

    await Product.findOneAndUpdate(
      { _id: productId, quantity: { $gte: quantity} },
      { $inc: { quantity: -quantity } },
      { upsert: true }
    );

    res.render('product/cart', { user, cart });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// CART route

router.get('/cart', async (req, res) => {
  const user = req.session.user;
  console.log(user);
  try {
    let cart = await Cart.findOne({ customerAddress: user.address });

    if (!cart) {
      cart = new Cart({ customerAddress: user.address });
    }
    console.log(cart);
    res.render('product/cart', { user, cart });
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
