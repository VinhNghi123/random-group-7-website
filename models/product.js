// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

// DEPEDENCIES
const mongoose = require('mongoose');

// CREATE PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length >= 10 && v.length <= 20;
            },
            message: 'Length must be between 10 and 20 characters.'
        }
    },
    vendorName: {
        type: String,
    },
    price: {
        type: Number,
        validate: {
            validator: function (v) {
            return v > 0;
            }
        },
    },
    image: {
        type: String,
    },
    description: {
        type: String, 
        validate: {
            validator: function (v) {
            return 0 <= v.length && v.length <= 500;
            }
        }
    },
    quantity: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// MODEL
module.exports = mongoose.model('Product', productSchema);