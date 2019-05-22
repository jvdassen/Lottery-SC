module.exports = async function dploy(web3, Oracle, Lottery) {
 
  var oracleInstance = await Oracle.new();
  var lotteryInstance = await Lottery.new(10, 3.0, 1.0, oracleInstance.address, 1)

  return {
    instances: {
      lottery: oracleInstance,
      oracle: lotteryInstance
    }
  }

}
