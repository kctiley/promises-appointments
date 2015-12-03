
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
      function(data){ 
        res.render('signUp', {errors: data.errors}) }
    );
});

router.get('/logIn', function(req, res, next) {
  res.render('logIn');
});

router.post('/login', function(req, res, next) {
  var errors = [];
  Helper.logInUser(req.body.email, req.body.password)
  .then(
    function (data){res.redirect('/');
    }, 
    function(err){
      errors.push(err);
      res.render('login', {errors: err.errors})
  }); 
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;