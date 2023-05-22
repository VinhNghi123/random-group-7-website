// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');


// IMPORT MODEL 
const User = require('../models/user');
const Product = require('../models/product')
const { Order, Cart } = require('../models/order');

//Session middleware
router.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));
router.use(fileUpload());

// ROUTES
//HOME
// Function to handle pagination
async function paginateProducts(req, res) {
    const itemsPerPage = 6; // Number of products to display per page
    const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter (default: 1)
    const user = req.session.user;
  
    try {
      let redirectUrl = './homepage/customer';
      let query = {};
      let orders = [];
  
      if (user) {
        const role = user.role;
        if (role === 'vendor') {
          redirectUrl = './homepage/vendor';
          query.vendorName = user.businessName;
        } else if (role === 'shipper') {
          redirectUrl = './homepage/shipper';
          query.shipperId = user._id;
          orders = await Order.find({});
          console.log(orders);
          res.render(redirectUrl, { user, orders });
        }
      }
  
      const totalCount = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalCount / itemsPerPage);
  
      const products = await Product.find(query);
        // .skip((page - 1) * itemsPerPage)
        // .limit(itemsPerPage);
  

        res.render(redirectUrl, { user, products, currentPage: page, totalPages });

    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while retrieving products');
    }
  }
  
  
// Pagination router
router.get('/', async (req, res) => {
    await paginateProducts(req, res);
});

// Homepage router
router.get('/home', async (req, res) => {
    await paginateProducts(req, res);
});


// LOGIN
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const rememberMe = req.body.rememberMe === 'on';
    // console.log(req.body);
    try {
      const user = await User.findOne({ username: username });
      // console.log(user);
      // CHECK USERNAME
      if (!user) {
        return res.status(400).send('Username does not exist');
      }
  
      // CHECK PASSWORD
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.send('Invalid username or password');
      }
      // user object in session
      req.session.user = user;
      // console.log(user);
      // console.log(req.session.cookie, rememberMe);
  
      // Cookies expires in 7 days
  
      if (typeof rememberMe !== 'undefined' && rememberMe) {
        req.session.cookie.maxAge = 7*24*60*60*1000
      };
      console.log('Login successful');
      await paginateProducts(req, res);
      next();
      
    } catch (error) {
        console.error(error);
      res.status(500).send();
    }
});
  


router.get('/about', (req, res) => {
    res.render('footer/about', { user: req.session.user })
});

router.get('/privacy', (req, res) => {
    res.render('footer/privacy', { user: req.session.user })
});

router.get('/help', (req, res) => {
    res.render('footer/help', { user: req.session.user })
});

router.get('/productDetail', async (req, res) => {
    const productID = req.query.id;

    try {
        const product = await Product.findOne({ _id: productID });

        if (!product) {
            return res.status(404).send('Product not found');
        };

        res.render('product/detail', {product, user: req.session.user});
    } catch {
        res.status(500).send();
    }
})

router.get('/filter', async (req, res) => {
    const {minPrice, maxPrice} = req.query;
    console.log(req.query);
    const user = req.session.user;
    const itemsPerPage = 6; // Number of products to display per page
    const page = parseInt(req.query.page) || 1;

    try {
        let products = await Product.find({price: { $gte: minPrice, $lte: maxPrice}});
        let redirectUrl = './homepage/customer';

        if (user) {
            if (user.role === 'vendor') {
                redirectUrl = './homepage/vendor';
                products = await Product.find({price: { $gte: minPrice, $lte: maxPrice}, vendorName: user.businessName});
            
            } else if (user.role === 'shipper') {
                redirectUrl = '/.homepage/shipper';
                products = await Order.find({totalPrice: { $gte: minPrice, $lte: maxPrice}, shipperId: user._id});
            }
        }
        // Count the total number of products
      const totalCount = await Product.countDocuments();
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalCount / itemsPerPage);
  
      
      // Render the products template with the products and pagination data
      res.render(redirectUrl, { user, products, currentPage: page, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.query;
    const user = req.session.user;
    const itemsPerPage = 6; // Number of products to display per page
    const page = parseInt(req.query.page) || 1;
  
    try {
      // Construct the search query using regex to match the product name or description
      const searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };
  
      let products = await Product.find(searchQuery);
  
      let redirectUrl = './homepage/customer';
  
      if (user) {
        if (user.role === 'vendor') {
          redirectUrl = './homepage/vendor';
          products = await Product.find({ ...searchQuery, vendorName: user.businessName });
  
        } else if (user.role === 'shipper') {
          redirectUrl = '/.homepage/shipper';
          products = await Order.find({ ...searchQuery, shipperId: user._id });
        }
      }
  
      // Count the total number of products matching the search query
      const totalCount = products.length;
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalCount / itemsPerPage);
  
      // Apply pagination to the products
      const paginatedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
      // Render the products template with the paginated products and pagination data
      res.render(redirectUrl, { user, products, currentPage: page, totalPages });
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });

module.exports = router;