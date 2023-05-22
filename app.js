// <!-- RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here. -->

const express = require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const paginate = require('paginate');
const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MDB_CONNECT)
.then(() => console.log('Database connected'))
.catch((error) => console.log(error.message));

// using middleware express.static to serve static files from
// public folder
app.use(express.static('public'));

// Sets the view / template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout');
app.use(expressLayouts)

console.log('set ejs')


// middleware
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));
console.log('set middleware')

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const myAccountRouter = require('./routes/myAccount');
const vendorAccountRouter = require('./routes/vendorAccount');
const homepageRouter = require('./routes/homepage');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');

app.use(orderRouter);
app.use(cartRouter);
app.use(myAccountRouter);
app.use(loginRouter);
app.use(registerRouter);
app.use(vendorAccountRouter);
app.use(homepageRouter);

//Start server
app.listen(3000, () => {
    console.log('Server is on port 3000')
})
