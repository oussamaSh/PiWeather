var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "kY1Y7rDM93BLVhJ4nhVN";
var mnemonic = "spin fan novel apology ask scatter embody early narrow ethics memory reunion";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }/*,
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3,
      gas: 3000000
    }*/
  }
};
