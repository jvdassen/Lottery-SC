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

	lotteryAndOracle1Winner();
});

function lotteryAndOracle1Winner () {
	it("One winner - One round", async function() {
		var lottery = await Lottery.deployed();
		var oracle = await Oracle.deployed();

		// Only player 3 buys ticket with winning number
		await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
		await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
		await lottery.buyTicket(winningNumber, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

		await oracle.reveal("1", {from: Player1});
		await oracle.reveal("dominik", {from: Player2});
		await oracle.reveal("helo", {from: Player3});
	});
}
