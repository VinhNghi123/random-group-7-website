// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Random Group 7 (floorIsLava)
// IDs: s3979298,s3924310,s3978216,s3981278,s3979290
// Acknowledgement: Acknowledge the resources that you use here.

// DROP DOWN CREATE PRODUCT FORM 

function toggleForm() {
    var form = document.getElementById("productForm");
    var openButton = document.getElementsByClassName("open-button")[0]; 
  
    if (form.style.display === 'none') {
      form.style.display = 'block';
      openButton.textContent = 'Close Form'; 
    } else {
      form.style.display = 'none';
      openButton.textContent = 'Open Form'; 
    }
  }
  

// FILTER

function updateMinPrice() {
    const output = document.getElementById("min-price-output");
    const value = document.getElementsByClassName("min-price")[0];
    output.textContent = value;
}

function updateMaxPrice(value) {
    const output = document.getElementById("max-price-output");
    const value = document.getElementsByClassName("max-price")[0];
    output.textContent = value;
}