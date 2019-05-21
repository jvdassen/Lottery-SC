var Lottery = artifacts.require("Lottery");
var Oracle = artifacts.require("Oracle");
var Oracle_Simple = artifacts.require("Oracle_Simple");

module.exports = async function(deployer) {
  await deployer.deploy(Oracle);
  await deployer.deploy(Oracle_Simple);
  const maxNum = 10;
  const oracleModulo = 10000;
  const price = web3.utils.toWei('3.0', "ether");
  const oracleCost = web3.utils.toWei('1.0', "ether");
  await deployer.deploy(Lottery,maxNum,price, oracleCost,Oracle.address, oracleModulo);
};
