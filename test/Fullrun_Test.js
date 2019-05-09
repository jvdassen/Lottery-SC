
var Oracle = artifacts.require("./Oracle.sol");
var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

contract("Full Run Test", async function(accounts) {
	
	var campaign;
	var random;

  var Player1 = accounts[0];
	var Player2 = accounts[1];
	var Player3 = accounts[2];
	var Player4 = accounts[3];
	
	it("Oracle", async function() {
        return await Oracle.deployed().then(async function(instance) {          
			
			var campagin = instance.LogCampaignAdded(function(error, response) {
				if (!error) {
					//console.log(response);
					campaign = response.args.campaignID
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});

			var commit = instance.LogCommit(function(error, response) {
				if (!error) {
					//console.log(response);
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});
			
			var reveal = instance.LogReveal(function(error, response) {
				if (!error) {
					//console.log(response);
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});

			var random = instance.LogRandom(function(error, response) {
				if (!error) {
					//console.log(response);
					random = response.args.random;
				}else{
					console.log(error);
				}
			});
			
			await instance.startNewCampaign(1,3,3, await web3.utils.toWei('1.0', "ether"),100);
			
			await instance.commit(campaign,"0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", {from: Player1,value: await web3.utils.toWei('1.0', "ether")});
			
			await instance.commit(campaign,"0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", {from: Player2,value: await web3.utils.toWei('1.0', "ether")});			

			await instance.reveal(campaign,"1", {from: Player1});
			await instance.reveal(campaign,"dominik", {from: Player2});

			//wait one transaction so the reveal deadline is reached
			await web3.eth.sendTransaction({ from: Player2, to: Player1, value:await web3.utils.toWei('1.0', "ether") });

			await instance.getRandom(campaign);

			console.log("RANDOM NUMBER IS: "+random);

		});
		});
		
		it("LotteryWithoutRandom", async function() {
			//var winningNumber = 5;
			return await Lottery.deployed().then(async function(instance) {  
			console.log("Player1:");      
			console.log(await web3.eth.getBalance(Player1));
			await instance.buyTicket(10, {from: Player1,value: await web3.utils.toWei('1.0', "ether")});
			console.log("Player1 after Ticket Buy:");      
			console.log(await web3.eth.getBalance(Player1));
			console.log("Player2:");      
			console.log(await web3.eth.getBalance(Player2));
			await instance.buyTicket(5, {from: Player2,value: await web3.utils.toWei('1.0', "ether")});
			console.log("Player2 after Ticket Buy:");      
			console.log(await web3.eth.getBalance(Player2));
			console.log("Player3:");      
			console.log(await web3.eth.getBalance(Player3));
			await instance.buyTicket(5, {from: Player3,value: await web3.utils.toWei('1.0', "ether")});
			console.log("Player3 after Ticket Buy:");      
			console.log(await web3.eth.getBalance(Player3));
			await instance.closeLotteryAtSomePointInTime(5);	
			console.log("Player1 after lottery:");      
			console.log(await web3.eth.getBalance(Player1));
			console.log("Player2 after lottery:");      
			console.log(await web3.eth.getBalance(Player2));
			console.log("Player3 after lottery:");      
			console.log(await web3.eth.getBalance(Player3));
  

			});
		});
	
    it("Instantiation", async function() {
        /*
		return await Lottery.deployed().then(async function(instance) {          

			return await IActor.at(TargetAddress).then(async function(owner) { 
				assert.equal(TargetOwner, await owner.getOwner(), "Target Address is wrong");
			});

		});
		*/
    });
	
});


function addition(a,b){
	return parseInt(a)+parseInt(b);
}
function subtraction(a,b){
	return parseInt(a)-parseInt(b);
}

function isAtMost(a,b){
	if(a<=b){
		return true;
	}	
	return false;
}

function isBiggerOrEqualThan(a,b){
	if(a>=b){
		return true;
	}	
	return false;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}