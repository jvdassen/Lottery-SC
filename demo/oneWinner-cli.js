var OracleContract = artifacts.require("./Oracle.sol")
var LotteryContract = artifacts.require("./Lottery.sol")
var catchRevert = require("./Exceptions.js").catchRevert
var Client = require("../cli/Cli")


var Player1
var Player2
var Player3
const winningNumber = 0

contract("Lottery and Oracle test", async function(accounts) {
  Player1 = accounts[0]
  Player2 = accounts[1]
  Player3 = accounts[2]

  it("Client usage", async function() {
    var winningNumber = 0
    var client = new Client(OracleContract, LotteryContract)

    var lottery = await client.startSmallLottery()
    var receipt = await client.buyTicket(lottery, winningNumber, Player1)
    await client.enableAutoReveal()
    client.informAboutUpdates()

    var receipt = await client.buyTicket(lottery, 2, Player2)
    var receipt = await client.buyTicket(lottery, 3, Player3)
    await timeout(1000)
/*	Run this for a second round
    await timeout(4000)
    var receipt = await client.buyTicket(lottery, winningNumber, Player1)

    var receipt = await client.buyTicket(lottery, 2, Player2)
    var receipt = await client.buyTicket(lottery, 5, Player3)
    await timeout(1000)
    */
  })
})

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
