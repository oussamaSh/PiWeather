var express = require('express');
var router = express.Router();

//var contract_infos = require('../data/contract_infos.json')
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')

var contract = require("truffle-contract");
var path = require('path');
var Weather = require(path.join(__dirname, '../build/contracts/WeatherERC20Token.json'));

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var filePath = path.join(__dirname, '../build/contracts/WeatherERC20Token.json');

var WeatherContract = contract(Weather);
WeatherContract.setProvider(provider);

//var WeatherContract = contract(Weather);
//WeatherContract.setProvider(web3.currentProvider);
//dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof WeatherContract.currentProvider.sendAsync !== "function") {
  WeatherContract.currentProvider.sendAsync = function () {
    return WeatherContract.currentProvider.send.apply(
      WeatherContract.currentProvider,
      arguments
    );
  };
}

function bindEvents() {
  $(document).on('click', '.btn-adopt', payForToken());
  $(document).on('click', '.btn-approve', approveTransfer());
  $(document).on('click', '.btn-getBalance', getBalance());
}

router.get('/getBalance', function (req, res) {
  getBalance();
});

function getBalance() {
  var payInstance;
  web3.eth.getAccounts(function (error, accounts) {

    var account = accounts[0];
    console.log(account);

    WeatherContract.deployed().then(function (instance) {
      payInstance = instance;
      var approved;

      return payInstance.balanceOf.call(account, { from: account });
    }).then(function (result) {
      console.log(result.toNumber())
    }).catch(function (err) {
      console.log(err.message);
    });
  })
};
module.exports.getbalance = getBalance();

function approveTransfer() {
  var payInstance;
  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];
    var account2 = accounts[1];

    WeatherContract.deployed().then(function (instance) {
      payInstance = instance;
      var approved;

      return payInstance.approve(account2, 1, { from: account });
    }).then(function (result) {
      console.log("Transaction successful!");
      // return App.markPaid();
    }).catch(function (err) {
      console.log(err.message);
    });
  });

};

function payForToken() {
  //event.preventDefault();

  var payInstance;

  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];
    var account2 = accounts[1];

    WeatherContract.deployed().then(function (instance) {
      payInstance = instance;
      //var approved = payInstance.approve(account2, 1,{from: account});
      // if(approved == true){
      return payInstance.transferFrom(account, account2, 1, { from: account2 });

      /*   }
         else {
           console.log("wiiiiiiiiiiiiw");
         }*/
    }).then(function (result) {
      alert("Transaction successful!");
      // return App.markPaid();
    }).catch(function (err) {
      console.log(err.message);
    });
  });

}

router.get('/', function (req, res, next) {
  // approveTransfer();
  //payForToken();
  getBalance();
  res.render('index');
});




module.exports = router;