var Lottery = artifacts.require("Lottery");
var Oracle = artifacts.require("Oracle");

module.exports = async function(deployer) {
  await deployer.deploy(Oracle);
  const maxNum = 10;
  const price = 1000;
  await deployer.deploy(Lottery,maxNum,price);
};