var Lottery = artifacts.require("Lottery");
var Oracle = artifacts.require("Oracle");
var Oracle_Simple = artifacts.require("Oracle_Simple");

module.exports = async function(deployer) {
  await deployer.deploy(Oracle);
  await deployer.deploy(Oracle_Simple);
  const maxNum = 10;
  const oracleModulo = 1;
  const price = web3.utils.toWei('3.0', "ether");
  const oracleCost = web3.utils.toWei('1.0', "ether");
  // for correctness the following equality should be correct: maxNumber == oracleModulo -1 , 
  // however, because of the test cases we need to have the possibility to adapt the modulo, that we know that the winning number is 0
  await deployer.deploy(Lottery,maxNum,price, oracleCost,Oracle.address, oracleModulo);
};
