var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { cookie: req.cookies.user_sid });
  console.log(req.cookies.user_sid);
});

module.exports = router;
