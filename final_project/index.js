const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const customer_routes = require('./router/auth_users.js').authenticated;
const general_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); 

// Only protect routes under `/customer/auth/*`
app.use("/customer/auth", verifyToken, customer_routes); 
app.use("/customer", customer_routes); // Add this so login works!
app.use("/", general_routes);

app.listen(PORT, () => console.log(`Arrr! The server be sailin’ on port ${PORT}! ⚓`));

// JWT Verification Middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "Arrr! Ye need to be logged in to do this!" });
    }

    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, "ArrrThisBeASecretKey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Arrr! Invalid token, ye scallywag!" });
        }
        req.user = decoded.username;
        next();
    });
}
