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
			var winningNumber = 5;
			var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
			var balancePlayer3after;

      var numberOfCampaignsCreated = 0;
      var numberOfCommitsMade = 0;

      var instance = await Lottery.deployed();
      var oracleInstance = await Oracle.deployed();
      oracleInstance.LogCampaignAdded(function(error, response) {
        if (!error) {
          numberOfCampaignsCreated++;
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });
      oracleInstance.LogCommit(function(error, response) {
        if (!error) {
          numberOfCommitsMade++;
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });


      
        await instance.buyTicket(10, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8", {from: Player1,value: await web3.utils.toWei('2.0', "ether")});
        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 2);
        balancePlayer1before = balancePlayer1after;
        
        await instance.buyTicket(5, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0", {from: Player2,value: await web3.utils.toWei('2.0', "ether")});
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 2);
        balancePlayer2before = balancePlayer2after;
        
        await instance.buyTicket(5, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac2", {from: Player3,value: await web3.utils.toWei('2.0', "ether")});
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 2);
        balancePlayer3before = balancePlayer3after;
        
//        await instance.closeLotteryIfApplicable(winningNumber);	
        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(numberOfCampaignsCreated, 1);
        assert.equal(numberOfCommitsMade, 3);
        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
        assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before) + 3);
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) + 3);
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
			await instance.buyTicket(10, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0",{from: Player1,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 2);
			balancePlayer1before = balancePlayer1after;
			
			await instance.buyTicket(3, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0",{from: Player2,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 2);
			balancePlayer2before = balancePlayer2after;	
			await instance.buyTicket(2, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0",{from: Player3,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 2);
			balancePlayer3before = balancePlayer3after;
			await instance.closeLotteryAtSomePointInTime(winningNumber);	
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
			assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before));
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before));

			// second round with one winner
			await instance.buyTicket(1, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0",{from: Player1,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 2);
			balancePlayer1before = balancePlayer1after;
			
			await instance.buyTicket(5, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0",{from: Player2,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 2);
			balancePlayer2before = balancePlayer2after;
			
			await instance.buyTicket(7, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0",{from: Player3,value: await web3.utils.toWei('2.0', "ether")});
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 2);
			balancePlayer3before = balancePlayer3after;
			
			await instance.closeLotteryAtSomePointInTime(winningNumber);	
			balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
			assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before) + 12);
			assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before));
			});
		});	
});
