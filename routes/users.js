
var express = require('express');
var router = express.Router();
var Helper = require('../lib/scripts.js');
var Promise = require('promise');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('userHome');
// });

router.get('/signUp', function(req, res, next) {
  res.render('signUp');
});

router.post('/signUp', function(req, res, next) {
  var errors = [];
  if(!req.body.email) {
    errors.push('Email is required');
  }
  if(!req.body.password) {
    errors.push('Password is required');
  }
  if(req.body.password !== req.body.passConf) {
    errors.push('Password and Password Confirmation must match');
  }
  if(errors.length) {
    console.log(errors);
    res.render('signUp', {errors: errors});
  }
  else {
    // Helper.addUser(req.body.email, req.body.password, res)
    // .then(function (data) {
    //   console.log("Data.errors", data.errors);
    //   if(data.errors) {
    //   res.render('signUp', {errors: data.errors});
    //   }
    //   else {
    //     // REVISE with better session use, JWT/database holder *
    //     // req.session.email = req.body.email;
    //     res.redirect('/');
    //   }
    // });
    Helper.checkIfUser(req.body.email)
    .then(function(){
      Helper.createUser(req.body.email, req.body.password)
      .then(function(data){
        res.redirect('/')
      })
    }, function(err){
      errors = err.errors
      res.render('signUp', {errors: errors})
    });



  }
});

router.get('/logIn', function(req, res, next) {
  res.render('logIn');
});

router.post('/login', function(req, res, next) {
  var errors = [];
  if(!req.body.email) {
    errors.push('Email is required');
  }
  if(!req.body.password) {
    errors.push('Password is required');
  }
  if(errors.length) {
    res.render('logIn', {errors: errors});
  }
  else {
    Helper.signin(req.body.email, req.body.password).then(function (data) {
      if(data.errors) {
        res.render('login', {errors: data.errors});
      }
      else {
        req.session.email = req.body.email;
        res.redirect('/users');
      }
    });
  }  
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;