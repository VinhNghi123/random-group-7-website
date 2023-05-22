// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

// DEPENDENCIES
const mongoose = require('mongoose');

// CONSTRAINTS
const passConstRegex = /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&]{8,20}$/

// USER SCHEMA


const userSchema = new mongoose.Schema({
    // USERNAME 
    username: {
      type: String,
      unique: true,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9]{8,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid username`
      },
    //   match: /^[a-zA-Z0-9]{8,15}$/,
      require: [true, `Username required`]
    },
    // PASSWORD
    password: {
      type: String,
    //   validate: {
    //     validator: function(v) {
    //       return passConstRegex.text(v);
    //     },
    //     message: props => `${props.value} is not a valid password`
    //   },
    //   match: passConstRegex,
      require: [true, `password required`]
    },
  
    // PROFILE PICTURE 
    profilePicture: {type: String, require: false},
    // ROLE
    role: {type: String, enum: [`customer`, `vendor`, `shipper`]},
    // if Customer
    name: {
        type: String,
        min: 5,
        required: function () {
            return this.role === 'customer';
        }
    },
    address: {
        type: String,
        min: 5,
        required: function () {
            return this.role === 'customer';
        }
    },
    // If vendor
    businessName: {
        type: String,
        min: 5,
        required: function () {
            return this.role === 'vendor';
        },
        unique: function () {
            return this.role === 'vendor';
        }
    },
    businessAddress: {
        type: String,
        min: 5,
        required: function () {
            return this.role === 'vendor';
        },
        unique: function () {
            return this.role === 'vendor';
        }
    },
    // If Shipper
    hubNameAndAddress : {
        type: String,
        enum: [`hub1/A1`, `hub2/A2`, `hub3/A3`],
        required: function() {
            return this.role === 'Shipper';
        }
    },
    // CREATED DATE
    createdAt: {
        type: Date,
        default: Date.now
    }
  });
  
// Export models to use in other parts of application
module.exports = mongoose.model('User', userSchema);