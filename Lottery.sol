pragma solidity ^0.5.7;

contract Lottery {
    State lotteryState;
    uint numberOfTickets = 0;
    uint totalPriceMoney = 0;
    mapping (uint => Ticket[]) tickets;
    uint64[] ticketNumbers;
    address[] winners;
    uint256 numberOfWinners = 0;
    
    struct State {
        bool open;
        uint8 round;
        uint64 maxNumber;
        uint64 ticketPrice;
    }
    
    struct Ticket {
        uint64 number;
        address sender;
    }
    
    constructor (uint maxNum, uint price) {
        lotteryState = State(true, 0, maxNum, price);
	closeLotteryAtSomePointInTime();
    }
    
    function buyTicket (uint64 numberForTicket) public payable costs(lotteryState.ticketPrice) lotteryIsOpen() {
        tickets[numberOfTickets++].push(Ticket(numberForTicket, msg.address));
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
        for(uint64 memberIndex = 0; memberIndex < numberOfTickets; memberIndex++) {
            for (uint64 ticketIndex = 0; ticketIndex < tickets[numberOfTickets].length; ticketIndex++) {
                if(tickets[memberIndex][ticketIndex].number == lotteryResult) {
                    winners.push(tickets[memberIndex][ticketIndex].sender);
                }   
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
                resetLotteryCompletely
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
        // do this e.g. after N blocks
        lotteryState.open = false;
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
}

