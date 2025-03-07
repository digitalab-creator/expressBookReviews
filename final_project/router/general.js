const express = require('express');
const axios = require('axios'); // Arrr, Axios be our tool for makin’ requests!
let books = require("./booksdb.js");

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; 

    if (!username || !password) {
      return res.status(400).json({ message: "Arrr! Username and password be required!" });
    }

    const userExists = users.find((user) => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: "Arrr! That username be already taken, matey!" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: `Arrr! User '${username}' be registered successfully!` });
});

// **Get the book list using Promise callbacks**
public_users.get('/promise', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Arrr! No books found!");
        }
    })
    .then((data) => res.status(200).json({ books: data }))
    .catch((err) => res.status(404).json({ message: err }));
});

// **Get the book list using async-await and Axios**
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/"); 
        return res.status(200).json({ books: response.data });
    } catch (error) {
        return res.status(404).json({ message: "Arrr! Trouble fetchin’ the books!" });
    }
});

// **Task 11: Get book details based on ISBN using Promises**
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Arrr! No book found with that ISBN!");
        }
    })
    .then((book) => res.status(200).json({ book }))
    .catch((err) => res.status(404).json({ message: err }));
});

// **Task 11: Get book details based on ISBN using async-await and Axios**
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        return res.status(200).json({ book: response.data });
    } catch (error) {
        return res.status(404).json({ message: "Arrr! No book found with that ISBN!" });
    }
});

// **Task 12: Get book details based on Author using Promises**
public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("Arrr! No books found by that author!");
        }
    })
    .then((books) => res.status(200).json({ books }))
    .catch((err) => res.status(404).json({ message: err }));
});

// **Task 12: Get book details based on Author using async-await and Axios**
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        return res.status(200).json({ books: response.data });
    } catch (error) {
        return res.status(404).json({ message: "Arrr! No books found by that author!" });
    }
});

// **Task 13: Get book details based on Title using Promises**
public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
        const matchingBook = Object.values(books).find(book => book.title.toLowerCase() === title);
        if (matchingBook) {
            resolve(matchingBook);
        } else {
            reject("Arrr! No book found with that title!");
        }
    })
    .then((book) => res.status(200).json({ book }))
    .catch((err) => res.status(404).json({ message: err }));
});

// **Task 13: Get book details based on Title using async-await and Axios**
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        return res.status(200).json({ book: response.data });
    } catch (error) {
        return res.status(404).json({ message: "Arrr! No book found with that title!" });
    }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  
    if (books[isbn]) {
        return res.status(200).json({ reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Arrr! No book found with that ISBN!" });
    }
});

module.exports.general = public_users;
