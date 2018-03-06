

App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('../build/contracts/WeatherERC20Token.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var WeatherArtifact = data;
      App.contracts.WeatherERC20Token = TruffleContract(WeatherArtifact);

      // Set the provider for our contract
      App.contracts.WeatherERC20Token.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markPaid();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-transferFrom', App.payForToken);
    $(document).on('click', '.btn-approve', App.approveTransfer);
    $(document).on('click', '.btn-getToken', App.getBalance);
  },

  markPaid: function (adopters, account) {
    var payInstance;

    App.contracts.WeatherERC20Token.deployed().then(function (instance) {
      payInstance = instance;

      return payInstance.getBuyers.call();
    }).then(function (buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },


  getBalance: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var payInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.WeatherERC20Token.deployed().then(function (instance) {
        payInstance = instance;
        var approved;
        
        return payInstance.balanceOf.call(account);
      }).then(function (result) {
        console.log(result.toNumber())
        return App.markPaid();
      }).catch(function (err) {
        console.log(err.message);
      });
    });

  },

  approveTransfer: function () {
    

    //var petId = parseInt($(event.target).data('id'));

    var payInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = "0x7Ca58F260d7a84FBe9ECa5575679a9a1b0a87B4b";
      var account2 = "0x1fC8E0B41f2b02b107EC52569efb677bccD10Ab1";
      App.contracts.WeatherERC20Token.deployed().then(function (instance) {
        payInstance = instance;
        var approved;
       
        return payInstance.approve(accounts[0], 1,
        {from: account});
      }).then(function (result) {
        console.log("Transaction successful!");
        return App.markPaid();
      }).catch(function (err) {
        console.log(err.message);
      });
    });

  },

  payForToken: function (event) {
    event.preventDefault();

    var payInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = "0x7Ca58F260d7a84FBe9ECa5575679a9a1b0a87B4b";
      var account2 = "0x1fC8E0B41f2b02b107EC52569efb677bccD10Ab1";
     console.log(account);
      App.contracts.WeatherERC20Token.deployed().then(function (instance) {
        payInstance = instance;
       // var approved = payInstance.approve(account2, 1,{from: account});
      //  if(approved == true){
          return payInstance.transferFrom(account,account2, 1, {from: account2});
/*
        }
        else {
          console.log("error");
        }*/
      }).then(function (result) {
        alert("Transaction successful!");
        return App.markPaid();
      }).catch(function (err) {
        console.log(err.message);
      });
    });

  }

};


(function($, document, window){
	
	$(document).ready(function(){

		// Cloning main navigation for mobile menu
		$(".mobile-navigation").append($(".main-navigation .menu").clone());

		// Mobile menu toggle 
		$(".menu-toggle").click(function(){
			$(".mobile-navigation").slideToggle();
		});

		var map = $(".map");
		var latitude = map.data("latitude");
		var longitude = map.data("longitude");
		if( map.length ){
			
			map.gmap3({
				map:{
					options:{
						center: [latitude,longitude],
						zoom: 15,
						scrollwheel: false
					}
				},
				marker:{
					latLng: [latitude,longitude],
				}
			});
			
		}
	});

	$(window).load(function(){

    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
    }

    App.initWeb3();
    
      console.log(document.cookie.user_sid); 
    
	});

})(jQuery, document, window);