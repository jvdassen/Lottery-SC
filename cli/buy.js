module.exports = async function buy(number, secret,  account, lottery, web3) {

  await lottery.buyTicket(number, secret, {from: account,value: await web3.utils.toWei('4.0', "ether")});
}
