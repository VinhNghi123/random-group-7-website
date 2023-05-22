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
// const dotenv = require('dotenv').config();


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

// CHANGE PROFILE PICTURE ROUTE
router.post('/changeProfilePicture', async (req, res) => {
    const { username } = req.session.user;
    // console.log(username)
    // const newPfp = req.files ? req.files.profilePicture : null;
    // console.log(newPfp, req.files);
    const profilePicture = req.query

    try {
        let uploadPath = null;
        if (profilePicture) {
        //     uploadPath = 'public/uploads/' + newPfp.name.replace(/ /g, '-');
        //     await newPfp.mv(uploadPath);
        //     console.log(uploadPath);

            const updatePfp = await User.findOneAndUpdate(
                { username: username },
                { profilePicture: profilePicture },
                { new: true }
            );

        if (!updatePfp) {
            return res.status(404).send('User not found');
        }
        console.log(await User.findOne({username: username}));
        res.send('Profile Picture updated sucessfully');
        } else {
            res.status(400).send('No profile picture provided')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
});

// myAccount
router.get('/myAccount', async (req, res) => {
    const user = req.session.user;
    const role = user.role;

    try {
        res.render('myAccount', {
            title: 'My Account',
            user: user
        });
    } catch {
        res.status(500).send();
    }
});


module.exports = router;