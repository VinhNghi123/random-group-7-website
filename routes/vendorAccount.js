// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const router = express.Router();

// IMPORT MODEL
const Product = require('../models/product');

// Middleware
router.use(fileUpload());
router.use(express.urlencoded({ extended: true }));
router.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
  );

router.post('/add-product', async (req, res) => {
    const {productName, productPrice, productDescription, productQuantity, productImage } = req.body;
    // const image = req.files ? req.files.productImage : null;

    try {
        const product = await Product.findOne({ name: productName });
        console.log(product);
        if (product) {
            res.send('Product is already in the stock');
        } else {

            // move the uploaded image
            let uploadPath = null;
            // if (image) {
            //     uploadPath = 'public/product-images/' + image.name.replace(/ /g, '-');
            //     image.mv(uploadPath);
            //     console.log(uploadPath);
            // };

            const newProduct = new Product({
                name: productName,
                vendorName: req.session.user.businessName,
                price: productPrice,
                quantity: parseInt(productQuantity),
                image: productImage,
                description: productDescription
            });

            await newProduct.validate();
            await newProduct.save();
            console.log('Added a product');
            res.send(`<script>alert('Added a product'); windows.location.herf('/');</script>`);
        };
    } catch (error) {
        console.error(error);
        res.status(500).send(`${error}`);
    }
});

module.exports = router;