require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const app = express();
const applicationsController = require('./controllers/applications.js');
// Require our new middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Require controllers
const authController = require('./controllers/auth.js');

const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Use passUserToView middleware to make user available in views
app.use(passUserToView);

// GET Build the Applications Index Page
app.get('/', (req, res) => {
  // Check if the user is signed in
  if (req.session.user) {
    // Redirect signed-in users to their applications index
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    // Show the homepage for users who are not signed in
    res.render('index.ejs');
  }
});

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

// removed the VIP lounge & updated the index.ejs to skyrockit

// Authentication routes
app.use('/auth', authController);
// Use isSignedIn middleware to protect routes that come after this
app.use(isSignedIn);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationsController);

// Start the server
app.listen(port, () => {
  console.log(`The express app is running on port ${port}!`);
});
