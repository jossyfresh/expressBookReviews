const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {

  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  if(users[username]) {
    return res.status(400).send('Username already exists');  
  }

  users[username] = { 
    username, 
    password 
  };
  console.log(users);

  return res.status(201).send({"message":"Customer Successfully Registered , Please login to continue"});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksToReturn = books
  if (!booksToReturn) {
    return res.status(404).json({message: "No books found"});
  }
  return res.status(200).json(booksToReturn);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Find the book with the specified ISBN
  const book = books[isbn];

  // If the book is found, return it
  if (book) {
    res.status(200).json(book);
  } else {
    // If the book is not found, return a 404 error
    res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.values(books).filter(book => {
    return book.author.includes(author); 
  });

  return res.status(200).json(booksByAuthor)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  const matchedBooks = Object.values(books).filter(book => {
    return book.title.toLowerCase().includes(title.toLowerCase());  
  });

  if (matchedBooks.length > 0) {
    res.status(200).json(matchedBooks);
  } else {
    res.status(404).send('No books found with that title');
  }

});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {

  const isbn = req.params.isbn;

  if(!books[isbn]) {
    return res.status(404).send('Book not found');
  }

  const reviews = books[isbn].reviews;

  return res.status(200).json(reviews);

});

module.exports.general = public_users;
