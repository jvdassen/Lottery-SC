module.exports = async function getAccounts(web3, i) {
  var accounts = await web3.eth.getAccounts();
  if(i) {
    return accounts[i]
  } return accounts
}
