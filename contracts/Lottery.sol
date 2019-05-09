pragma solidity ^0.5.0;

contract Lottery {
    State lotteryState;
    uint64 numberOfTickets = 0;
    uint256 totalPriceMoney = 0;
    mapping (uint => Ticket) tickets;
    uint64[] ticketNumbers;
    address[] winners;
    uint256 numberOfWinners = 0;
    
    struct State {
        bool open;
        uint8 round;
        uint64 maxNumber;
        uint256 ticketPrice;
    }
    
    struct Ticket {
        uint64 number;
        address sender;
    }
    
    constructor (uint64 maxNum, uint256 price) public {
        lotteryState = State(true, 0, maxNum, price);
		//closeLotteryAtSomePointInTime();
    }
    
    function buyTicket (uint64 numberForTicket) public payable costs(lotteryState.ticketPrice) lotteryIsOpen() numberIsAllowed(numberForTicket){
        tickets[numberOfTickets++] = Ticket(numberForTicket, msg.sender);
		totalPriceMoney = totalPriceMoney + lotteryState.ticketPrice;
		ticketNumbers.push(numberForTicket);
    }
    
    function numberWasGuessed (uint64 lotteryResult) private view returns (bool) {
        bool found = false;
        for(uint64 i = 0; i < ticketNumbers.length; i++) {
            if(ticketNumbers[i] == lotteryResult) {
                found = true;
                return found;
            }
        }
        return found;
    }
    
    function computeWinners (uint64 lotteryResult) private {
        for (uint64 ticketIndex = 0; ticketIndex < numberOfTickets; ticketIndex++) {
            if(tickets[ticketIndex].number == lotteryResult) {
                winners.push(tickets[ticketIndex].sender);
            }
        }
        numberOfWinners = winners.length;
    }
    
    function payOut () private lotteryIsClosed() {
            if(numberOfWinners == 0) {
                //no one claimed the price money -> reset ticket purchases but keep payOut
                resetTicketPurchases();
                
            } else {
                // one or more persons claimed the price -> pay them and reset the lottery
                uint pricePerWinner = totalPriceMoney / numberOfWinners;
                for(uint winnerIndex = 0; winnerIndex < winners.length; winnerIndex++) {
                    // create transaction and send the price to each winner
                }
                resetLotteryCompletely();
            }
        
    }
    
    function resetLotteryCompletely () private lotteryIsClosed() {
        resetTicketPurchases();
        resetLotteryState();
    }
    
    function resetLotteryState () private {
        
    }
    
    function queryLotteryNumberFromOracle () private {
        
    }
    
    function closeLotteryAtSomePointInTime () private {
        // TODO do this e.g. after N blocks
        lotteryState.open = false;
	// TODO: input variable should be random computed with the oracle of compute winners
	    computeWinners(5);
        payOut();
    }
    
    function resetTicketPurchases () private {
            //Configuration lotteryState;
            numberOfTickets = 0;
            //delete tickets;
            delete ticketNumbers;
            delete winners;
            numberOfWinners = 0;
    }
    
    modifier costs(uint _amount) {
        require(
            msg.value >= _amount,
            "Not enough Ether provided."
        );
        _;
        if (msg.value > _amount)
            msg.sender.transfer(msg.value - _amount);
    }
    
    modifier lotteryIsOpen () {
        require(
            lotteryState.open,
            "Lottery cant accept ticket purchases at this stage"
        );
        _;
    }
    modifier lotteryIsClosed () {
        require(
            !lotteryState.open,
            "Lottery is still open"
        );
        _;
    }

    modifier numberIsAllowed (uint64 numberForTicket) {
        require(
            numberForTicket>=0 && numberForTicket<=lotteryState.maxNumber,
            "Lottery cant accept such a number, it is out of range"
        );
        _;
    }
}

