const express = require('express')
const router = express.Router();



//creating a route

router.get('/index', (req, res) => {
    res.render('index');
  });
  
  router.get('/login', (req, res) => {
    res.render('loginPage', { msg:''});
  });
  
  router.get('/register', (req, res) => {

    res.render('registerPage', { msg:''});

  });

 
  module.exports=router;