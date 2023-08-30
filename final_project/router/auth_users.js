const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];




//only registered users can login
regd_users.post('/login', (req, res) => {

  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const user = users[username];

  if(!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate access token
  const token = jwt.sign({userId: user.id}, 'secretKey',{expiresIn: '1h'});
  
  return res.status(200).json({
    message: 'Login successful', 
    token: token
  });

});

// Add/update review
regd_users.put('/auth/review/:isbn', (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  const book = books[isbn];

  if(!book) {
    return res.status(404).send('Book not found');
  }

  if(!review) {
    return res.status(400).send('Review must be provided');
  }

  const existingReview = book.reviews[username];
  
  if(existingReview) {
    book.reviews[username] = review;
  } else {
    book.reviews[username] = review; 
  }

  return res.status(200).send(`The Review for the Book with ISBN ${isbn} has been added/updated`);

});

// delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.username;

  const book = books[isbn];

  if(!book) {
    return res.status(404).send('Book not found');
  }

  if(!book.reviews[username]) {
    return res.status(400).send('Review not found');
  }

  delete book.reviews[username];

  return res.status(200).send('Review deleted');

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
