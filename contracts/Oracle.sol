pragma solidity ^0.5.0;

import {Lottery} from './Lottery.sol';

contract Oracle {

    constructor () public payable{

    }

	State public c;

    struct Participant {
        string    secret;
        bytes32   commitment;
        bool      revealed;
    }

    modifier notBeBlank(bytes32 _s) {if (_s == "") revert("Should not be blank but is"); _;}

    modifier beBlank(bytes32 _s) {if (_s != "") revert("User allready commited a secret. Secret per user is limited to 1."); _;}

    modifier beFalse(bool _t) {if (_t) revert("Should be false but is true"); _;}

	struct State {
        address owner;
        uint256 deposit;
        uint16  modulo;
        bool    commitPhase;
        bool    revealPhase;
        uint256 numberOfSecrets;
        bytes32 random;
        uint256 result;
        uint32  commitNum;
        uint32  revealsNum;
        uint256  minimumFunding;
        uint256 earliestEndOfRevealPhase;
		mapping (address => Participant) participants;
        address payable[]  addressesOfParticipants;
	}


	function initializeOracleState(uint256 numberOfSecrets,uint256 minimumFunding,uint16 modulo) public {

        c.minimumFunding = minimumFunding;
        c.modulo = modulo;
        c.owner = msg.sender;
        c.commitNum = 0;
        c.revealsNum = 0;
        c.deposit = 0;
        c.commitPhase = true;
        c.revealPhase = false;
        c.numberOfSecrets = numberOfSecrets;
        c.random = 0;
    }

	event LogCommit(address indexed from, bytes32 commitment);

    function commit(bytes32 hashedSecret, address payable author) external
    notBeBlank(hashedSecret) payable {
        if (msg.value < c.minimumFunding) revert("Please provide the necessary funds");
        if (!c.commitPhase) revert("Currently the lottery is not in the commit phase.");
        commitmentState(hashedSecret, author);
        c.deposit += msg.value;
    }

	function commitmentState(
        bytes32 hashedSecret,
        address payable author
    )internal
    beBlank(c.participants[author].commitment) {
        c.participants[author] = Participant("", hashedSecret, false);
        c.addressesOfParticipants.push(author);
        c.commitNum++;
        emit LogCommit(author, hashedSecret);
        if(c.commitNum >= c.numberOfSecrets){
            c.commitPhase = false;
            c.revealPhase = true;
            c.earliestEndOfRevealPhase = block.number + c.numberOfSecrets;
            emit RevealOpen(true);
        }
    }

  event RevealOpen(bool open);
	event LogReveal(address indexed from, string secret);

    function reveal(string calldata secret) external {
        Participant storage p = c.participants[msg.sender];
       // if (block.number >= c.revealDeadline) revert("Revealphase is already over");
        if (!c.revealPhase) revert("Currently the lottery is not in the reveal phase.");
        revealState(secret, p);
    }

    modifier checkSecret(string memory secret, bytes32 _commitment) {
        if (keccak256(abi.encodePacked(secret)) != _commitment) revert("Secret is not the same");
        _;
    }

    function revealState(
        string memory secret,
        Participant storage p
    ) internal
    checkSecret(secret, p.commitment)
    beFalse(p.revealed){
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

    function endLottery( ) external {
        if(block.number > c.earliestEndOfRevealPhase){
            // not everyone revealed -> return invested ether for this lottery round
            returnFunds();
            Lottery(c.owner).returnTicketPrices();

            //reset the commits
            resetParticipants();
        }else{
            revert("It is too early to end the lottery");
        }
    }

    function returnRandom() internal returns (uint256) {
        if (c.revealsNum == c.commitNum) {
            // everyone revealed
            c.result = uint256(c.random) % c.modulo;
            emit LogRandom(c.result);
            Lottery(c.owner).closeLotteryIfApplicable(c.result);
            returnFunds();
            //reset the participants, that a new lottery round can start
            resetParticipants();
             return c.result;
         }else {
            // not everyone revealed -> return invested ether for this lottery round
            returnFunds();
            Lottery(c.owner).returnTicketPrices();
        }
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
