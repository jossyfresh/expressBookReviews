const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {

    // Get access token from request header
    const tok = req.header('Authorization');

    const token = tok.slice(7);
    console.log(token)

  
    if(!token) {
      return res.status(401).send('Access denied. No token provided.');
    }
  
    try {
      // Verify and decode token 
      const decoded = jwt.verify(token, 'secretKey', {expiresIn: '1h'});
      
      // Assign user details to request
      req.user = decoded; 
  
    } catch (err) {
        console.log("Invalid token")
        console.log(token)
      return res.status(400).send('Invalid token.')
    }
  
    return next();
  
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
