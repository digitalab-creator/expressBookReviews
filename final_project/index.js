const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  // Arr, me matey! We be checkin' the user's session fer a precious token,
  // may the Flying Spaghetti Monster guide our noodly way!
  if (req.session.authorization) {
    // The token be hidden under the 'accessToken' property, arrr!
    let token = req.session.authorization['accessToken'];

    // We verify the token with jwt, by the great noodly appendages!
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        // The user be proven genuine, onward ye go! RAmen!
        req.user = user;
        next();
      } else {
        // Ye token be cursed, walk the plank!
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    // We found no token in the session, so ye shall not pass! RAmen!
    return res.status(403).json({ message: "User not logged in" });
  }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
