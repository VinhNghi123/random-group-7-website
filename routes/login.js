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
const session = require('express-session')

// IMPORT MODELS
const User = require('../models/user');
const Product = require('../models/product');
const { Order, Cart } = require('../models/order');

// Configure middleware
router.use(express.urlencoded({ extended: true }));
router.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
})
);

router.get('/login', loginHandler);
router.get('/myAccount', loginHandler);

function loginHandler (req, res) {
    const user = req.session.user;
    if (!user) {
        res.render('login', {user, title: 'Login Page'})
    }
    res.render('myAccount', {user: user, title: 'My Account'});
};


module.exports = router;
