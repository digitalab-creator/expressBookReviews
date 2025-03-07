const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "ArrrThisBeASecretKey";

// Check if username exists
const isValid = (username) => {
    return users.some((user) => user.username === username);
};

// Check user credentials
const authenticatedUser = (username, password) => {
    return users.some((user) => user.username === username && user.password === password);
};

// User Login (JWT-Based)
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Arrr! Username and password be required!" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Arrr! Invalid username or password!" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({
        message: "Arrr! Login successful, ye scallywag!",
        token: token
    });
});

// Verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "Arrr! Ye need to be logged in to post a review!" });
    }

    try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Arrr! Invalid token, ye scallywag!" });
    }
};

// Add/Modify Review
regd_users.put("/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Arrr! No book found with that ISBN!" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Arrr! Review by '${username}' be added/updated successfully!`,
        reviews: books[isbn].reviews
    });
});

// Delete Review
regd_users.delete("/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Arrr! No book found with that ISBN!" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Arrr! Ye have no review to delete for this book!" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: `Arrr! Review by '${username}' be deleted successfully!`,
        reviews: books[isbn].reviews
    });
});

// Register New User
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Arrr! Username and password be required!" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "Arrr! That username already exists!" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "Arrr! Registration successful, welcome aboard!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
