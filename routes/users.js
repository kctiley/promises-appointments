
var express = require('express');
var router = express.Router();
var Helper = require('../lib/scripts.js');

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
    Helper.addUser2(req.body.email, req.body.password, res).then(function (data) {
      if(data.errors) {
        res.render('signUp', {errors: data.errors});
      }
      else {
        req.session.email = req.body.email;
        res.redirect('/users');
      }
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