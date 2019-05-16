var Oracle = artifacts.require("./Oracle.sol");
var Oracle_Simple = artifacts.require("./Oracle_Simple.sol");
var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

contract("Lottery test", async function(accounts) {
	
  var Player1 = accounts[0];
	var Player2 = accounts[1];
	var Player3 = accounts[2];
  var Player4 = accounts[3];
  
  // important: these tests can only work individually, because the participiants aren't reset when the lottery is found,
  // because these these doesn't connect to the lottery, hence when another round is started the oracle crashes.
  //lottery2Winners();
  //lottery1Winner();

  function lottery2Winners () {
		it("LotteryWithoutRandomWith2WinnersOutOfThreePlayers", async function() {
			var winningNumber = 5;
			var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
			var balancePlayer3after;

      var instance = await Lottery.deployed();
      
        await instance.buyTicket(10, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 4);
        balancePlayer1before = balancePlayer1after;
        
        await instance.buyTicket(5, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac0", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 4);
        balancePlayer2before = balancePlayer2after;
        
        await instance.buyTicket(5, "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac2", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
        balancePlayer3before = balancePlayer3after;

        // This would be called from the Oracle!
        await instance.closeLotteryIfApplicable(winningNumber)
        
        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');

        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
        //assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before) + 4.5);
        //assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) + 4.5);
		});	
  }

  function lottery1Winner () {
		it("Lottery with 1 winner", async function() {
      var winningNumber = 5;
			var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
			var balancePlayer3after;

      var instance = await Lottery.deployed();
      
        await instance.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 4);
        balancePlayer1before = balancePlayer1after;
        
        await instance.buyTicket(3, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 4);
        balancePlayer2before = balancePlayer2after;
        
        await instance.buyTicket(5, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
        balancePlayer3before = balancePlayer3after;

        await instance.closeLotteryIfApplicable(winningNumber);	

        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        
        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before));
        assert.equal(Math.round(balancePlayer2after), Math.round(balancePlayer2before));
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) + 9);
    });	
  }
});