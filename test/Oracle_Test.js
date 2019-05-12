
var Oracle = artifacts.require("./Oracle.sol");
var Oracle_Simple = artifacts.require("./Oracle_Simple.sol");
var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

contract("Full Run Test", async function(accounts) {
	
	var campaign;
	var rand;
	var oracleInstance;
	var lotteryInstance;

  var Player1 = accounts[0];
	var Player2 = accounts[1];
	var Player3 = accounts[2];
	var Player4 = accounts[3];
	
	it("Oracle", async function() {
		
			lotteryInstance = await Lottery.deployed();
			oracleInstance = await Oracle.deployed();
		
      var campagin = oracleInstance.LogCampaignAdded(function(error, response) {
        if (!error) {
          //console.log(response);
          campaign = response.args.campaignID
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var commit = oracleInstance.LogCommit(function(error, response) {
        if (!error) {
          //console.log(response);
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });
      
      var reveal = oracleInstance.LogReveal(function(error, response) {
        if (!error) {
          //console.log(response);
          //Address = response.args.addr;
        }else{
          console.log(error);
        }
      });

      var random = oracleInstance.LogRandom(function(error, response) {
        if (!error) {
          //console.log(response);
          rand = response.args.random;
        }else{
          console.log(error);
        }
      });
      
      await oracleInstance.startNewCampaign(3,3, await web3.utils.toWei('1.0', "ether"),100);
      
      await oracleInstance.commit(campaign,"0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6", Player1, {from: Player1,value: await web3.utils.toWei('1.0', "ether")});
      
      await oracleInstance.commit(campaign,"0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d", Player2, {from: Player2,value: await web3.utils.toWei('1.0', "ether")});			

      await oracleInstance.reveal(campaign,"1", {from: Player1});
      
      await oracleInstance.reveal(campaign,"dominik", {from: Player2});

      //wait one transaction so the reveal deadline is reached
      await web3.eth.sendTransaction({ from: Player2, to: Player1, value:await web3.utils.toWei('1.0', "ether") });

      await oracleInstance.getRandom(campaign);

      //console.log("RANDOM NUMBER IS: "+rand);

      assert.equal(rand, 40);
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
