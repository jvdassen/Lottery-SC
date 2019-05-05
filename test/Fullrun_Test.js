
var Oracle = artifacts.require("./Oracle.sol");
//var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

contract("Full Run Test", async function(accounts) {
	
	var protocol;
	var oracle;
	var campaign;
	
    var Player1 = accounts[0];
	var Player2 = accounts[1];
	
	it("Oracle", async function() {
        return await Oracle.deployed().then(async function(instance) {          
			
			var campagin = instance.LogCampaignAdded(function(error, response) {
				if (!error) {
					console.log(response);
					campaign = response.args.campaignID
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});

			var commit = instance.LogCommit(function(error, response) {
				if (!error) {
					console.log(response);
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});
			
			var reveal = instance.LogReveal(function(error, response) {
				if (!error) {
					console.log(response);
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});
			
			await instance.startNewCampaign();
			
			await instance.commit(campaign,"0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6");	

			await instance.reveal(campaign,"1");	

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