var Lottery = artifacts.require("Lottery");
var Oracle = artifacts.require("Oracle");

module.exports = async function(deployer) {
  await deployer.deploy(Oracle);
  const maxNum = 10;
  const price = web3.utils.toWei('1.0', "ether");
  await deployer.deploy(Lottery,maxNum,price);
};