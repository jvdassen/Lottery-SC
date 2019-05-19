var Oracle = artifacts.require("./Oracle.sol");
var Oracle_Simple = artifacts.require("./Oracle_Simple.sol");
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
	/*
  lotteryAndOracle0WinnersFirstRound1WinnerSecondRound();
  lotteryAndOracleNotEveryoneRevealed();
  lotteryAndOracl2Winners();
  lotteryAndOracle0Winners();
	*/
});

function lotteryAndOracle1Winner () {
		it("One winner - One round", async function() {

      var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
      var balancePlayer3after;

      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();

			lottery.LotteryEnd(function(error, response) {
				if (!error) {
					//numberOfCommitsMade++;
					//Address = response.args.addr;
					console.log(lottery.address)
					console.log(oracle.address)

					console.log(response);
				}else{
					console.log(error);
				}
			});

      oracle.LogCommit(function(error, response) {
        if (!error) {
          numberOfCommitsMade++;
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      oracle.LogReveal(function(error, response) {
        if (!error) {
          //console.log(response);
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var random = oracle.LogRandom(function(error, response) {
        if (!error) {
          //console.log(response);
          //rand = response.args.random;
        }else{
          console.log(error);
        }
      });


        await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 4);
        balancePlayer1before = balancePlayer1after;

        await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 4);
        balancePlayer2before = balancePlayer2after;

        await lottery.buyTicket(winningNumber, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
        balancePlayer3before = balancePlayer3after;


        await oracle.reveal("1", {from: Player1});
        await oracle.reveal("dominik", {from: Player2});
        await oracle.reveal("helo", {from: Player3});

        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');

        var oracleFee = 1;
        assert.equal(Math.round(balancePlayer1after)-oracleFee, Math.round(balancePlayer1before));
        assert.equal(Math.round(balancePlayer2after)-oracleFee, Math.round(balancePlayer2before));
        assert.equal(Math.round(balancePlayer3after)-oracleFee, Math.round(balancePlayer3before) + 9);
		});
}
function lotteryAndOracl2Winners () {
		it("Two winners - One round", async function() {

      var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
      var balancePlayer3after;

      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();

      oracle.LogCommit(function(error, response) {
        if (!error) {
          numberOfCommitsMade++;
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var reveal = oracle.LogReveal(function(error, response) {
        if (!error) {
          //console.log(response);
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var random = oracle.LogRandom(function(error, response) {
        if (!error) {
          //console.log(response);
          rand = response.args.random;
        }else{
          console.log(error);
        }
      });

      await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
      balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
      assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 4);
      balancePlayer1before = balancePlayer1after;

      await lottery.buyTicket(winningNumber, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
      balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
      assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 4);
      balancePlayer2before = balancePlayer2after;

      await lottery.buyCommitfreeTicket(3, {from: Player2,value: await web3.utils.toWei('3.0', "ether")});
      balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
      assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 3);
      balancePlayer2before = balancePlayer2after;

      await lottery.buyTicket(winningNumber, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});
      balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
      assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
      balancePlayer3before = balancePlayer3after;

        await oracle.reveal("1", {from: Player1});
        await oracle.reveal("dominik", {from: Player2});
        await oracle.reveal("helo", {from: Player3});

        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');

        var oracleFee = 1;
        assert.equal(Math.round(balancePlayer1after)-oracleFee, Math.round(balancePlayer1before));
        assert.equal(Math.round(balancePlayer2after)-oracleFee, Math.round(balancePlayer2before) + 6);
        assert.equal(Math.round(balancePlayer3after)-oracleFee, Math.round(balancePlayer3before) + 6);
      });
}

function lotteryAndOracle0Winners () {
		it("No winners - One round", async function() {

      var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
			var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
			var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
			var balancePlayer1after;
			var balancePlayer2after;
      var balancePlayer3after;

      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();

      oracle.LogCommit(function(error, response) {
        if (!error) {
          numberOfCommitsMade++;
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var reveal = oracle.LogReveal(function(error, response) {
        if (!error) {
          //console.log(response);
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var random = oracle.LogRandom(function(error, response) {
        if (!error) {
          //console.log(response);
          rand = response.args.random;
        }else{
          console.log(error);
        }
      });


      await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
      balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
      assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 4);
      balancePlayer1before = balancePlayer1after;

      await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
      balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
      assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 4);
      balancePlayer2before = balancePlayer2after;

      await lottery.buyTicket(3, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});
      balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
      assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
      balancePlayer3before = balancePlayer3after;


        await oracle.reveal("1", {from: Player1});
        await oracle.reveal("dominik", {from: Player2});
        await oracle.reveal("helo", {from: Player3});

        balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
        balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');

        var oracleFee = 1;
        assert.equal(Math.round(balancePlayer1after)-oracleFee, Math.round(balancePlayer1before));
        assert.equal(Math.round(balancePlayer2after)-oracleFee, Math.round(balancePlayer2before));
        assert.equal(Math.round(balancePlayer3after)-oracleFee, Math.round(balancePlayer3before));
      });
}

function lotteryAndOracle0WinnersFirstRound1WinnerSecondRound () {
		it("One winner in second round", async function() {

      var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
      var balancePlayer3after;

      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();

      oracle.LogCommit(function(error, response) {
        if (!error) {
          numberOfCommitsMade++;
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var reveal = oracle.LogReveal(function(error, response) {
        if (!error) {
          //console.log(response);
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var random = oracle.LogRandom(function(error, response) {
        if (!error) {
          //console.log(response);
          rand = response.args.random;
        }else{
          console.log(error);
        }
      });


        await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
        await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
        await lottery.buyTicket(5, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
        balancePlayer3before = balancePlayer3after;

        await oracle.reveal("1", {from: Player1});
        await oracle.reveal("dominik", {from: Player2});
        await oracle.reveal("helo", {from: Player3});

        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');

        var oracleFee = 1;

        assert.equal(Math.round(balancePlayer3after)-oracleFee, Math.round(balancePlayer3before));
        balancePlayer3before = balancePlayer3after;

        await timeout(3000);
        await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});

        await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});

        await lottery.buyTicket(winningNumber, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
        balancePlayer3before = balancePlayer3after;

        await oracle.reveal("1", {from: Player1});
        await oracle.reveal("dominik", {from: Player2});
        await oracle.reveal("helo", {from: Player3});

        balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
        assert.equal(Math.round(balancePlayer3after)-oracleFee, Math.round(balancePlayer3before)+18);
		});
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function lotteryAndOracleNotEveryoneRevealed() {
  it("Not Everyone Revealed", async function() {

    var balancePlayer1before = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
    var balancePlayer2before = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
    var balancePlayer3before = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
    var balancePlayer1after;
    var balancePlayer2after;
    var balancePlayer3after;

    var lottery = await Lottery.deployed();
    var oracle = await Oracle.deployed();

    await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
    balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
    assert.equal(Math.round(balancePlayer1after), Math.round(balancePlayer1before) - 4);
    balancePlayer1before = balancePlayer1after;

    await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
    balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
    assert.equal(Math.round(balancePlayer2after) , Math.round(balancePlayer2before) - 4);
    balancePlayer2before = balancePlayer2after;

    await lottery.buyTicket(6, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});
    balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');
    assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before) - 4);
    balancePlayer3before = balancePlayer3after;

      await oracle.reveal("1", {from: Player1});
      await oracle.reveal("dominik", {from: Player2});

      try {
        await oracle.endLottery({from: Player2});
      } catch (error) {
       // assert.equal("It is too early to end the lottery", error.reason)
      }

      //  wrong reveal
      try {
          await oracle.reveal("hello", {from: Player3});
      } catch (error) {
          assert.equal("Secret is not the same", error.reason)
      }

      await oracle.endLottery({from: Player2});


      balancePlayer1after = await web3.utils.fromWei(await web3.eth.getBalance(Player1),'ether');
      balancePlayer2after = await web3.utils.fromWei(await web3.eth.getBalance(Player2),'ether');
      balancePlayer3after = await web3.utils.fromWei(await web3.eth.getBalance(Player3),'ether');

      // player 3 did not reveal -> return from oracle is bigger for them who revealed
      var oracleFee = 1*3 /2;
      assert.equal(Math.round(parseInt(balancePlayer1after)-oracleFee), Math.round(balancePlayer1before)+3);
      assert.equal(Math.round(parseInt(balancePlayer2after)-oracleFee), Math.round(balancePlayer2before)+3);
      assert.equal(Math.round(balancePlayer3after), Math.round(balancePlayer3before)+3);
    });
}
