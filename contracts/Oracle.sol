pragma solidity ^0.5.0;

contract Oracle {
	
    constructor () public{
        
    }

	Campaign[] public campaigns;

    struct Participant {
        string      secret;
        bytes32   commitment;
        uint256   reward;
        bool      revealed;
        bool      rewarded;
    }
	
	event LogCampaignAdded(uint256 indexed campaignID);

    modifier notBeBlank(bytes32 _s) {if (_s == "") revert("Should not be blank but is"); _;}

    modifier beBlank(bytes32 _s) {if (_s != "") revert("Should be blank but is not"); _;}

    modifier beFalse(bool _t) {if (_t) revert("Should be false but is true"); _;}
	
	struct Campaign {
		uint256   id;
        address   owner;
        uint96    deposit;
        uint16    commitBalkline;
        uint16    commitDeadline;

        uint256   random;
        bool      settled;
        uint32    commitNum;
        uint32    revealsNum;

		mapping (address => Participant) participants;
	}

    
	
	function startNewCampaign() public{
        
		uint256 campaginId = campaigns.length++;
		Campaign storage c = campaigns[campaginId];
        c.owner = msg.sender;
		c.id = campaginId;
		emit LogCampaignAdded(campaginId);
    }
	
	  
	event LogCommit(uint256 indexed CampaignId, address indexed from, bytes32 commitment);

    function commit(uint256 campaignId, bytes32 hashedSecret) notBeBlank(hashedSecret) external payable {
        Campaign storage c = campaigns[campaignId];
        commitmentCampaign(campaignId, hashedSecret, c);
    }
	
	function commitmentCampaign(
        uint256 campaignId,
        bytes32 hashedSecret,
        Campaign storage c
    )  beBlank(c.participants[msg.sender].commitment) internal {
        c.participants[msg.sender] = Participant("0", hashedSecret, 0, false, false);
        c.commitNum++;
        emit LogCommit(campaignId, msg.sender, hashedSecret);
    }
    
	event LogReveal(uint256 indexed CampaignId, address indexed from, string secret);

    function reveal(uint256 campaignId, string calldata secret) external {
        Campaign storage c = campaigns[campaignId];
        Participant storage p = c.participants[msg.sender];
        revealCampaign(campaignId, secret, c, p);
    }

    modifier checkSecret(string memory secret, bytes32 _commitment) {
        if (keccak256(abi.encodePacked(secret)) != _commitment) revert("Secret is not the same");
        _;
    }

    function revealCampaign(
        uint256 campaignId,
        string memory secret,
        Campaign storage c,
        Participant storage p
    )   checkSecret(secret, p.commitment)
        beFalse(p.revealed) internal {
        p.secret = secret;
        p.revealed = true;
        c.revealsNum++;
        //c.random ^= p.secret;
        emit LogReveal(campaignId, msg.sender, secret);
    }

    function getRandom(uint256 campaignId) external returns (uint256) {
        Campaign storage c = campaigns[campaignId];
        return returnRandom(c);
    }

    function returnRandom(Campaign storage c) internal returns (uint256) {
        if (c.revealsNum == c.commitNum) {
            c.settled = true;
            return c.random;
        }
    }
}
