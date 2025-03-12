// controllers/applications.js
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router.get('/', (req, res) => {
//     res.send('Hello applications index route!');
//   });

router.get('/', async (req, res) => {
    try {
      res.render('applications/index.ejs');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

module.exports = router;
