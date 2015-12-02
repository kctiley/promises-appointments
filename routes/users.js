
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
  Helper
    .createUser(req.body.email, req.body.password, req.body.passConf)
    .then(
      function(){ res.redirect('/') },
      function(err){ res.render('signUp', {errors: err.errors}) }
    );
});

router.get('/logIn', function(req, res, next) {
  res.render('logIn');
});

// router.post('/login', function(req, res, next) {
//   var errors = [];
//   if(!req.body.email) {
//     errors.push('Email is required');
//   }
//   if(!req.body.password) {
//     errors.push('Password is required');
//   }
//   if(errors.length) {
//     res.render('logIn', {errors: errors});
//   }
//   else {
//     Helper.signin(req.body.email, req.body.password).then(function (data) {
//       if(data.errors) {
//         res.render('login', {errors: data.errors});
//       }
//       else {
//         req.session.email = req.body.email;
//         res.redirect('/users');
//       }
//     });
//   }  
// });

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
    Helper.logInUser(req.body.email, req.body.password)
    .then(function (data) {
      // req.session.email =  req.body.email;
      res.redirect('/');
    }, function(err){
      errors = err.errors;
      res.render('login', {errors: errors})
    });
  }  
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;