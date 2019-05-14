var Oracle = artifacts.require("./Oracle.sol");
var Oracle_Simple = artifacts.require("./Oracle_Simple.sol");
var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

var Player1;
var Player2;
var Player3;
var Player4;

contract("Demo", async function(accounts) {
	
	var campaign;
	var rand;
	var oracleInstance;
	var lotteryInstance;
  Player1 = accounts[0];
	Player2 = accounts[1];
	Player3 = accounts[2];
	Player4 = accounts[3];

  oneWinner();
  //twoWinners();
  //noWinners();
  //oneWinnerInSecondRound();
});

function oneWinner () {
		it("One Winner - One Round", async function() {
			var winningNumber = 5;

      var numberOfCampaignsCreated = 0;
      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();
      var campaign;
      oracle.LogCampaignAdded(function(error, response) {
        if (!error) {
          numberOfCampaignsCreated++;
          campaign = response.args.campaignID
          //Address = response.args.addr;
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
        
        await lottery.buyTicket(7, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

        await oracle.reveal(campaign,"1", {from: Player1});
        await oracle.reveal(campaign,"dominik", {from: Player2});
        await oracle.reveal(campaign,"helo", {from: Player3});

        var rand = await oracle.getRandom(campaign);
        
        
        var oracleFee = 1;
		});	
}
function twoWinners () {
		it("Two Winners - One Round", async function() {
			var winningNumber = 5;

      var numberOfCampaignsCreated = 0;
      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();
      var campaign;
      oracle.LogCampaignAdded(function(error, response) {
        if (!error) {
          numberOfCampaignsCreated++;
          campaign = response.args.campaignID
          //Address = response.args.addr;
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
        
        await lottery.buyTicket(7, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
        
        await lottery.buyTicket(7, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

        await oracle.reveal(campaign,"1", {from: Player1});
        await oracle.reveal(campaign,"dominik", {from: Player2});
        await oracle.reveal(campaign,"helo", {from: Player3});

        var rand = await oracle.getRandom(campaign);
		});	
}

function noWinners () {
		it("No winners - One round", async function() {
			var winningNumber = 5;

      var numberOfCampaignsCreated = 0;
      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();
      var campaign;
      oracle.LogCampaignAdded(function(error, response) {
        if (!error) {
          numberOfCampaignsCreated++;
          campaign = response.args.campaignID
          //Address = response.args.addr;
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
        
        await lottery.buyTicket(3, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

        await oracle.reveal(campaign,"1", {from: Player1});
        await oracle.reveal(campaign,"dominik", {from: Player2});
        await oracle.reveal(campaign,"helo", {from: Player3});

        var rand = await oracle.getRandom(campaign);
		});	
}

function oneWinnerInSecondRound () {
		it("0 Winners First Round - 1 Winner Second Round", async function() {
			var winningNumber = 5;

      var numberOfCampaignsCreated = 0;
      var numberOfCommitsMade = 0;

      var lottery = await Lottery.deployed();
      var oracle = await Oracle.deployed();
      var campaign;
      oracle.LogCampaignAdded(function(error, response) {
        if (!error) {
          numberOfCampaignsCreated++;
          campaign = response.args.campaignID
          //Address = response.args.addr;
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


        await oracle.reveal(campaign,"1", {from: Player1});
        await oracle.reveal(campaign,"dominik", {from: Player2});
        await oracle.reveal(campaign,"helo", {from: Player3});

        var rand = await oracle.getRandom(campaign);
        
        var oracleFee = 1;
      await timeout(3000);
        await lottery.buyTicket(10, "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('4.0', "ether")});
        
        await lottery.buyTicket(4, "0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('4.0', "ether")});
        
        await lottery.buyTicket(7, "0xfe29ae60035e8b541f5ba39d708138f4d015cae36e88bc6ebfcacb744fbad758", {from: Player3,value: await web3.utils.toWei('4.0', "ether")});

        await oracle.reveal(campaign,"1", {from: Player1});
        await oracle.reveal(campaign,"dominik", {from: Player2});
        await oracle.reveal(campaign,"helo", {from: Player3});

        var rand = await oracle.getRandom(campaign);
        
		});	
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

