var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/outfitadviser', function (req, res, next) {

 // console.log(req.session.user);
  console.log(req.session.user.username);
  res.render('outfitadviser');
});

router.get('/returnIndex',function(req,res){
})

module.exports = router;