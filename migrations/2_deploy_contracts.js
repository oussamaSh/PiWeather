var WeatherERC20Token = artifacts.require("WeatherERC20Token");
module.exports = function(deployer) {
  deployer.deploy(WeatherERC20Token);
};