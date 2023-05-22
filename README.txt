
I. How to run the website in your localhost
- Make sure the repository "Local_source" after extracting is the root directory.
- If you have Visual Studio Code, open the folder in your VSC, open Terminal (View > Terminal), and type in:
` npm install` -- to install all npm packages
` node app.js ` -- to start the server
- Open browser and access : ` localhost:3000 ` 
- The website should be running.

II. Links

- GitHub Repository:
- Demo video: 

- Accounts:
a. Customer:
    Username: Customer001
    Password: Customer001!

b. Vendor:
    Username: Vendor101
    Password: Vendor101!

c. Shipper:
    Username: Shipper001
    Password: Shipper001!

III. Some constraints:
username: contains only letters (lower and upper case) and digits, has a length from 8 to 15 characters, unique.
password: contains at least one upper case letter, at least one lower case letter, at least one digit, at least one special letter in the set !@#$%^&*, NO other kind of characters, has a length from 8 to 20 characters.
Other fields are required and have a minimum length of 5 characters (except the profile picture, which is a file upload, and the shipper's distribution hub, which is a drop-down select).

IV. Repository structure
1. app.js
- main server file launching Node.js server and init middleware
(such as Express and Mongoose)

2. public folder:
- static assets such as CSS, client-side JS, images

3. views folder:
- EJS views templates

4. models folder:
- Mongoose models used for database interaction

5. routes folder:
- Express routing logic that handles incoming HTTP requests
- Renders views using EJS templates

