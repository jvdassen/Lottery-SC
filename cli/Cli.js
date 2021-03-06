module.exports = function Client (OracleContract, LotteryContract, lotteryInstance) {
  this.lotteryInstance = lotteryInstance || null
  this.oracleInstance = null
  this.Oracle = OracleContract
  this.Lottery = LotteryContract
  this.counter = 0
  this.userNumber = null
  this.userBalance = 0

  this.secrets = [
  ]
  

  Client.prototype.startSmallLottery = async function (options) {
    this.lotteryInstance = await this.Lottery.deployed()
    this.oracleInstance = await this.Oracle.deployed()
    return this.lotteryInstance
  }

  Client.prototype.generateHashedSecret = async function (input) {
    return web3.utils.keccak256(input)
  }
  Client.prototype.buyTicket = async function (lotteryInstance, number, player) {
    var secret = "" + Math.random() * 10000000000000000

    var hashedSecret = await this.generateHashedSecret(secret)
    this.secrets.push({
      hash: hashedSecret,
      secret: secret,
      user: player
    })

    if(this.counter == 0) {
      this.userNumber = number 
      this.userBalance = await web3.utils.fromWei(await web3.eth.getBalance(player))
    }
    await this.lotteryInstance.buyTicket(number, hashedSecret, { from: player, value: web3.utils.toWei('4.0', "ether") })
    this.counter++
    await timeout(3000)
    return this.counter
  }

  Client.prototype.checkAutoReveal = async function () {
    //if(this.counter == 3) {
      console.log('INFO: Lottery has enough players.. Starting autoreveal')
      this.secrets.forEach(async (el, i) => {
        await this.oracleInstance.reveal(el.secret, {from: el.user})
      })
  }

  Client.prototype.enableAutoReveal = function ( ) {
    var client = this;
    this.oracleInstance.RevealOpen(async function () {
      await client.checkAutoReveal()
    })

  }

  Client.prototype.informAboutUpdates = function () {
    var client = this
    this.oracleInstance.LogCommit(function (err, response) {
       console.log('INFO: Someone else just joined your lottery!')
    })
    this.lotteryInstance.LotteryEnd(async function (err, response) {
       var winners = response.args.winners
       var winningNumber = parseInt(response.args.winningNumber)
       var pot = web3.utils.fromWei(response.args.pot)
       var rewardPerWinner = web3.utils.fromWei(response.args.pricePerWinner)

       console.log('INFO: Your lottery has ended.')
       console.log('INFO: Number is picked: ', parseInt(response.args.winningNumber))
       if(winners.indexOf(client.secrets[0].user) >= 0) {
         console.log('INFO: 🎉 You just won the lottery 🎉')
       }
      var newBalance = await web3.utils.fromWei(await web3.eth.getBalance(client.secrets[0].user))
      console.log('INFO: Your balance changed by ', newBalance - client.userBalance)
	    console.log('INFO: Summary of this game:')
	    console.table([{
	      successful: winners.length > 0 ? 'yes' : 'no',
	      winners: winners.map(e => `${e.substr(0, 6)}..${e.substr(-6)}`),
              pot: pot,
	      number: winningNumber,
	      averageReward: winners.length > 0 ? rewardPerWinner : 0
	    }])

       client.secrets = []
       client.counter = 0
       client.userBalance = 0
    })
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
