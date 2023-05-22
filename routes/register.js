// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

// DEPENDENCIES
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv').config();

// IMPORT USER MODEL
const User = require('../models/user.js');

// MIDDLEWARE
router.use(fileUpload({
    limits: {fileSize: 10 * 1024 * 1024},
}));
router.use(express.urlencoded({ extended: true }));


// REGISTER
router.get('/register', (req, res) => {
    res.render('role-selection', { title: `Role selection`, user: req.session.user });
});

router.get('/role-selection', (req, res) => {
    const role = req.query.role;
    console.log(role, req.body);
    // to not include nav bar
    let isUser;
    res.render('registrationPage', {
        title: 'Registration',
        role: role,
        user: req.body});
});


// Create an account in database

router.post('/create-an-account', async(req, res) => {
    const { username, password, role, profilePicture } = req.body;
    console.log(role);
    const passConstRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,20}$/;

    // const profilePicture = req.files ? req.files.profilePicture : null;

    try {
        // HASH PASSWORD
        if (!passConstRegex.test(password)) {
            throw new Error('Password format is wrong')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // CREATE NEW USER
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            profilePicture
          });

        // upload profile picture
        // let uploadPath = null;
        // if (profilePicture) {
        //     uploadPath = 'public/uploads/' + profilePicture.name.replace(/ /g, '-');
        //     await profilePicture.mv(uploadPath);
        //     newUser.profilePicture = uploadPath;
        // }
        // console.log(uploadPath);

        // CHECK ROLES
        if (role === 'vendor') {
        newUser.businessName = req.body['business-name'];
        newUser.businessAddress = req.body['business-address'];
        } else if (role === 'shipper') {
        newUser.hubNameAndAddress = req.body['distribution-hub'];
        } else if (role === 'customer') {
        newUser.name = req.body['customer-name'];
        newUser.address = req.body['customer-address'];
        }
        await newUser.validate();
        await newUser.save();
        res.redirect('./login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Cannot create an account');
    }
});

module.exports = router;