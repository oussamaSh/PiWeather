var express = require('express');
var router = express.Router();
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/outfitadviser', function (req, res, next) {
  console.log(localStorage.getItem('connectedUser'));
  res.render('outfitadviser');
});

router.get('/returnIndex',function(req,res){
  console.log(localStorage.getItem('connectedUser'))
  res.send(localStorage.getItem('connectedUser'))
})

module.exports = router;