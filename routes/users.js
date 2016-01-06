var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
var router = express.Router();

// configure passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// end configuration for passport

router.get('/', function(req, res){
  res.render('user', { user: req.user });
});

router.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/user' }), function(req, res) {
  res.redirect('/');
});

router.get('/registration', function(req, res){
  res.render('registration', { user: req.user });
});

router.post('/registration', function(req, res){
  User.registration(new User({
    username: req.body.username //from the form
  }),
  req.body.password,
  function(err, user) {
    if (err) {
      return res.render('registration', { user: user });
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/homepage');
    });
  });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/homepage');
});

module.exports = router;