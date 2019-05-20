var Oracle = artifacts.require("./Oracle.sol");
var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

var Player1;
var Player2;
var Player3;
const winningNumber = 0;

contract("Lottery and Oracle test", async function(accounts) {
  Player1 = accounts[0];
  Player2 = accounts[1];
  Player3 = accounts[2];

  it("Client usage", async function() {
    var client = new Client();

    var lottery = await client.startSmallLottery()
    var receipt = await client.buyTicket(lottery, 0, Player1)
    client.informAboutUpdates()

    var receipt = await client.buyTicket(lottery, 1, Player2)
    var receipt = await client.buyTicket(lottery, 2, Player3)
    await timeout(1000)
  });
});


function Client () {
  this.lotteryInstance = null
  this.oracleInstance = null;
  this.Oracle = Oracle;
  this.Lottery = Lottery;
  this.counter = 0;
  this.userNumber = null;
  this.userBalance = 0;

  this.secrets = [
    {
      hash: "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6",
      secret: "1",
      user: null
    },
    {
      hash: "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d",
      secret: "dominik",
      user: null
    },
    {
      hash: "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758",
      secret: "helo",
      user: null
    }
  ]
  

  Client.prototype.startSmallLottery = async function (options) {
    this.lotteryInstance = await this.Lottery.deployed()
    this.oracleInstance = await this.Oracle.deployed()
    return this.lotteryInstance
  }

  Client.prototype.buyTicket = async function (lotteryInstance, number, player) {
    if(this.counter == 0) {
      this.userNumber = number
      this.userBalance = await web3.utils.fromWei(await web3.eth.getBalance(player))
    }
    this.secrets[this.counter].user = player
    await this.lotteryInstance.buyTicket(number, this.secrets[this.counter].hash, {from: player, value: web3.utils.toWei('4.0', "ether")})
    this.counter++
    await timeout(3000)
    await this.checkAutoReveal()
    return this.counter;

  }
  Client.prototype.checkAutoReveal = async function () {
    if(this.counter == 3) {
      console.log('INFO: Lottery has enough players.. Starting autoreveal')
      this.secrets.forEach(async (el) => {
        await this.oracleInstance.reveal(el.secret, {from: el.user});
      })
    }
  }
  Client.prototype.informAboutUpdates = function () {
    var client = this;
    this.oracleInstance.LogCommit(function (err, response) {
       console.log('INFO: Someone else just joined your lottery!')
    })
    this.oracleInstance.LogRandom(async function (err, response) {
       var randnr = parseInt(response.args.random)
       console.log('INFO: Your lottery has ended.')
       console.log('INFO: Number is picked: ', randnr)
       if(randnr == client.userNumber) {
         console.log('INFO: 🎉 You just won the lottery 🎉')
       }
      var newBalance = await web3.utils.fromWei(await web3.eth.getBalance(client.secrets[0].user))
	    console.log('INFO: Your balance changed by ', newBalance - client.userBalance)
    })
  }

}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
