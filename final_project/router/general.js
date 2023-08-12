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

  return res.status(201).send({"message":"Customer Successfully Registered , Please login to continue"});

});


// create a promise to get all books
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(books)
    } else {
      reject(new Error('No books found')) 
    }
  })
}


// Get the book list available in the shop
public_users.get('/', async function(req, res) {

  try {
    const allBooks = await getAllBooks()
    res.status(200).json(allBooks)

  } catch (error) {
   res.status(500).send(error.message) 
  }

})

// Get book details based on ISBN

// create a promise to get book by isbn
const getBookByIsbn = isbn => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found'));
    }
  });
}

public_users.get('/isbn/:isbn', async function(req, res) {
  const isbn = req.params.isbn;

  try {
    const book = await getBookByIsbn(isbn);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});
  

// create a promise to get books by author
const getBooksByAuthor = author => {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => {
      return book.author.toLowerCase().includes(author.toLowerCase());
    });
    
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error('No books found for author'));
    }
  });
}

// Get book details based on author
public_users.get('/author/:author', async function(req, res) {

  const author = req.params.author;

  try {
    const books = await getBooksByAuthor(author);
    res.status(200).json(books);
  } catch (error) {
    res.status(404).send(error.message);
  }

});

// create a promise to get books by title
const getBooksByTitle = title => {
  return new Promise((resolve, reject) => {  
    const matchedBooks = Object.values(books).filter(book => {
      return book.title.toLowerCase().includes(title.toLowerCase());
    });
    
    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject(new Error('No books found with that title'));
    }
  });
}

// Get all books based on title

public_users.get('/title/:title', async function(req, res) {

  const title = req.params.title;

  try {
    const books = await getBooksByTitle(title);
    res.status(200).json(books);
  } catch (error) {
    res.status(404).send(error.message);
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
