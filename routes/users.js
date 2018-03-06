var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find(function (err, users) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(users);
    }
  })
});

router.post('/register', function (req, res) {
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    isTokenValid: false,
    accountAdresse: req.body.accountAdresse
  });

  user.save(function (err, result) {
    if (err) {
      return res.send(err);
    }
    res.redirect('/');
  })
})



router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email },
    function (err, user) {
      if (err) { res.send(err); }
      else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          console.log('user connected');
          //localStorage.setItem('connectedUser',user);
          req.session.user = user.username;
         // console.log(JSON.stringify(localStorage.getItem('connectedUser')));
         console.log(req.session.user);
          res.send(localStorage.getItem('connectedUser'));
          //res.redirect('/');
        }
      }

    })
})

router.get('/logout',function(req,res){
  localStorage.removeItem('connectedUser');
  res.redirect('/');
})
router.get('/returnIndex',function(req,res){
  console.log(localStorage.getItem('connectedUser'))
})
module.exports = router;
