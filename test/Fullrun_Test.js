
var Oracle = artifacts.require("./Oracle.sol");
//var Lottery = artifacts.require("./Lottery.sol");
let catchRevert = require("./Exceptions.js").catchRevert;

contract("Full Run Test", async function(accounts) {
	
	var protocol;
    var oracle;
	
    var Player1 = accounts[0];
	var Player2 = accounts[1];
	
	it("Oracle", async function() {
        return await Oracle.deployed().then(async function(instance) {          
			
			var commit = instance.CommitHash(function(error, response) {
				if (!error) {
					console.log(response);
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});
			
			var reveal = instance.RevealHash(function(error, response) {
				if (!error) {
					console.log(response);
					//Address = response.args.addr;
				}else{
					console.log(error);
				}
			});
			
			await instance.commit("0xd91f4db0fc8ef29728d9521f4d07a7dd8b19cccb6133f4bf8bf400b8800beb2d");		

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