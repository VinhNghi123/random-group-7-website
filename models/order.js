// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.


// DEPEDENCIES
const mongoose = require('mongoose');

// IMPORT MODELS
const Product = require('../models/product');
const User = require('../models/user');
// CREATE ORDER SCHEMA

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        itemPrice: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: {type: Number, required: true},
    customerAddress: { type: String, required: true},
    status: {
        type: String,
        enum: ['active', 'delivered', 'cancelled'],
        default: 'active'
    },
    shipperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});



const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            
        },
        itemPrice: { type: Number },
        quantity: { type: Number }
    }],
    totalPrice: {
        type: Number, 
        default: 0,
        required: function() {
            return this.products.length > 0;
        }
    },
    customerAddress: { type: String, required: true},
    createdAt: {
        type: Date,
        default: Date.now,
    }
  });

// EXPORT MODELS
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Order, Cart };