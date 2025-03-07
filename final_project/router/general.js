const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Get username & password from request body
  
    // Check if username & password be provided
    if (!username || !password) {
      return res.status(400).json({ message: "Arrr! Username and password be required!" });
    }
  
    // Check if the username already exists
    const userExists = users.find((user) => user.username === username);
  
    if (userExists) {
      return res.status(400).json({ message: "Arrr! That username be already taken, matey!" });
    }
  
    // If all be good, add the new user
    users.push({ username, password });
    return res.status(201).json({ message: `Arrr! User '${username}' be registered successfully!` });
  });
  

// Get the book list available in the shop
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books: JSON.stringify(books, null, 2) });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Fetch the ISBN from the request
    if (books[isbn]) {
      return res.status(200).json({ book: books[isbn] });
    } else {
      return res.status(404).json({ message: "Arrr! No book found with that ISBN!" });
    }
  });
  
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase(); // Get the author from the request params
    const matchingBooks = [];
  
    // Loop through the books to find matching authors
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author) {
        matchingBooks.push(books[isbn]);
      }
    });
  
    // If books be found, return them; else, send a message
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Arrr! No books found by that author!" });
    }
  });
  

// Get all books based on title
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase(); // Get the title from the request params
    let matchingBook = null;
  
    // Loop through the books to find the matching title
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title) {
        matchingBook = books[isbn];
      }
    });
  
    // If a book be found, return it; else, send a message
    if (matchingBook) {
      return res.status(200).json({ book: matchingBook });
    } else {
      return res.status(404).json({ message: "Arrr! No book found with that title!" });
    }
  });
  
// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Fetch the ISBN from the request
  
    if (books[isbn]) {
      return res.status(200).json({ reviews: books[isbn].reviews });
    } else {
      return res.status(404).json({ message: "Arrr! No book found with that ISBN!" });
    }
  });
  

module.exports.general = public_users;
