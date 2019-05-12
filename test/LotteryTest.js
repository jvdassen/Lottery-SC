
var Oracle = artifacts.require("./Oracle.sol");
var Oracle_Simple = artifacts.require("./Oracle_Simple.sol");
var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

contract("Lottery test", async function(accounts) {
	
	var campaign;
	var rand;
	var oracleInstance;
	var lotteryInstance;

  var Player1 = accounts[0];
	var Player2 = accounts[1];
	var Player3 = accounts[2];
	var Player4 = accounts[3];
		it("LotteryWithoutRandomWith2WinnersOutOfThreePlayers", async function() {
			var winningNumber = 0;
			var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			//console.log(balancePlayer1before);
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
			var balancePlayer3after;

      var oracle = await Oracle_Simple.deployed();

			return await Lottery.deployed().then(async function(instance) {  

      var campagin = instance.LogNumber(function(error, response) {
        if (!error) {
//          console.log('Rand nr:', parseInt(response.args.winningNumber))
        }else{
          console.log(error);
        }
      });
		
			await instance.buyTicket(10, {from: Player1,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 2);
			balancePlayer1before = balancePlayer1after;
			
			await instance.buyTicket(0, {from: Player2,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 2);
			balancePlayer2before = balancePlayer2after;
			
			await instance.buyTicket(0, {from: Player3,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 2);
			balancePlayer3before = balancePlayer3after;
			
			await instance.closeLotteryAtSomePointInTime();	
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
			assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before) + 3);
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) + 3);

			});
		});	

		it("LotteryWithoutAWinnerInFirstRound", async function() {
			var winningNumber = 5;
			var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
			var balancePlayer3after;
			return await Lottery.deployed().then(async function(instance) {  
		

			//first round without winner
			await instance.buyTicket(10, {from: Player1,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 2);
			balancePlayer1before = balancePlayer1after;
			
			await instance.buyTicket(3, {from: Player2,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 2);
			balancePlayer2before = balancePlayer2after;	
			await instance.buyTicket(2, {from: Player3,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 2);
			balancePlayer3before = balancePlayer3after;
			await instance.closeLotteryAtSomePointInTime();	
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
			assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before));
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before));

			// second round with one winner
			await instance.buyTicket(1, {from: Player1,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 2);
			balancePlayer1before = balancePlayer1after;
			
			await instance.buyTicket(0, {from: Player2,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 2);
			balancePlayer2before = balancePlayer2after;
			
			await instance.buyTicket(7, {from: Player3,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 2);
			balancePlayer3before = balancePlayer3after;
			
			await instance.closeLotteryAtSomePointInTime();	
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
			assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before) + 12);
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before));
			});
		});	
});
