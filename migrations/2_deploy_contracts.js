var Lottery = artifacts.require("Lottery");
var Oracle = artifacts.require("Oracle");
var Oracle_Simple = artifacts.require("Oracle_Simple");

module.exports = async function(deployer) {
  await deployer.deploy(Oracle);
  await deployer.deploy(Oracle_Simple);
  const maxNum = 10;
  const price = web3.utils.toWei('2.0', "ether");
  await deployer.deploy(Lottery, maxNum, price, Oracle_Simple.address);
};
