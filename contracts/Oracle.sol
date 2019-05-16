pragma solidity ^0.5.0;

import {Lottery} from './Lottery.sol';

contract Oracle {

    constructor () public payable{

    }

	Campaign public c;

    struct Participant {
        string    secret;
        bytes32   commitment;
        bool      revealed;
    }

	event LogCampaignAdded(uint256 indexed campaignID);

    modifier notBeBlank(bytes32 _s) {if (_s == "") revert("Should not be blank but is"); _;}

    modifier beBlank(bytes32 _s) {if (_s != "") revert("Should be blank but is not"); _;}

    modifier timeNotOver(uint256 current, uint256 deadline) {if (current < deadline) revert("Deadline not reached yet"); _;}

    modifier beFalse(bool _t) {if (_t) revert("Should be false but is true"); _;}

	struct Campaign {
        address owner;
        uint256 deposit;
        uint16  modulo;
        uint256  commitDeadline;
        uint256  revealDeadline;
        bytes32 random;
        uint256 result;
        bool    settled;
        uint32  commitNum;
        uint32  revealsNum;
        uint256  minimumFunding;
		mapping (address => Participant) participants;
        address payable[]  addressesOfParticipants;
	}


	function startOrUpdateCampaign(uint256 commitDuration, uint16 revealDuration,uint256 minimumFunding,uint16 modulo) public {

        c.commitDeadline = block.number+commitDuration;
        c.revealDeadline = c.commitDeadline+revealDuration;
        c.minimumFunding = minimumFunding;
        c.modulo = modulo;
        c.owner = msg.sender;
        c.commitNum = 0;
        c.revealsNum = 0;
        c.deposit = 0;
        c.settled = false;
        c.random = 0;
    }

	event LogCommit(address indexed from, bytes32 commitment);

    function commit(bytes32 hashedSecret, address payable author) external
    notBeBlank(hashedSecret) payable {
        if (msg.value < c.minimumFunding) revert("Please provide the necessary funds");
        if (block.number >= c.commitDeadline) revert("Commitphase is already over");
        c.deposit += msg.value;
        commitmentCampaign(hashedSecret, author);
    }

	function commitmentCampaign(
        bytes32 hashedSecret,
        address payable author
    )internal
    beBlank(c.participants[author].commitment) {
        c.participants[author] = Participant("", hashedSecret, false);
        c.addressesOfParticipants.push(author);
        c.commitNum++;
        emit LogCommit(author, hashedSecret);
    }

	event LogReveal(address indexed from, string secret);

    function reveal(uint256 campaignId, string calldata secret) external {
        Participant storage p = c.participants[msg.sender];
       // if (block.number >= c.revealDeadline) revert("Revealphase is already over");
        if (block.number < c.commitDeadline) revert("Commitphase not over yet");
        revealCampaign(secret, p);
    }

    modifier checkSecret(string memory secret, bytes32 _commitment) {
        if (keccak256(abi.encodePacked(secret)) != _commitment) revert("Secret is not the same");
        _;
    }

    function revealCampaign(
        string memory secret,
        Participant storage p
    ) internal
    checkSecret(secret, p.commitment)
    beFalse(p.revealed)
    timeNotOver(block.number, c.commitDeadline) {
        p.secret = secret;
        p.revealed = true;
        c.revealsNum++;
        c.random ^= keccak256(abi.encodePacked(secret,msg.sender));
        emit LogReveal(msg.sender, secret);
        if(c.revealsNum == c.commitNum){
            returnRandom();
        }
    }

    event LogRandom(uint256 random);

    function getRandom() external returns (uint256) {
        if(c.settled==true){return c.result;}else{return returnRandom();}
    }

    function returnRandom() internal returns (uint256) {
        //TODOif(block.number >= c.revealDeadline){
            if (c.revealsNum == c.commitNum) {
                c.settled = true;
                c.result = uint256(c.random) % c.modulo;
                emit LogRandom(c.result);
                Lottery(c.owner).closeLotteryIfApplicable(c.result);
                returnFunds();
                //reset participants
                resetParticipants();
                return c.result;
            }else {
                returnFunds();
                revert("Not everyone has commited");
            }

        /*}else{
            revert("Please wait until the end of the reveal phase");
        }*/
    }

    function resetParticipants() internal{
        for(uint256 i = 0; i < c.addressesOfParticipants.length; i++){
             delete c.participants[c.addressesOfParticipants[i]];
        }
        delete c.addressesOfParticipants;
    }

    function returnFunds() internal {
        for(uint i = 0; i < c.addressesOfParticipants.length; i++) {
            if(c.participants[c.addressesOfParticipants[i]].revealed == true){
                c.addressesOfParticipants[i].transfer(c.deposit/c.revealsNum);
            }
        }
    }
}
