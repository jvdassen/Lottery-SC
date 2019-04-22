pragma solidity ^0.5.7;

contract Lottery {
    Configuration lotteryState;
    uint numberOfTickets = 0;
    uint totalPriceMoney = 0;
    mapping (uint => Ticket[]) tickets;
    uint64[] ticketNumbers;
    address[] winners;
    uint256 numberOfWinners;
    
    struct Configuration {
        bool open;
        uint8 round;
        uint64 maxNumber;
        uint64 ticketPrice;
    }
    
    struct Ticket {
        uint64 number;
        address sender;
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
    
    function buyTicket () public {
        if(lotteryState.open) {
            
        }
    }
    
    function payOut () private {
        if(!lotteryState.open) {
            uint pricePerWinner = totalPriceMoney / numberOfWinners;
            for(uint winnerIndex = 0; winnerIndex < winners.length; winnerIndex++) {
                // create transaction and send the price to each winner
            }
        }
    }
    
    function resetLotteryCompletely () private {
        resetTicketPurchases();
        resetLotteryState();
    }
    
    function resetLotteryState () private {
        
    }
    
    function queryLotteryNumberFromOracle () private {
        
    }
    
    function resetTicketPurchases () private {
            //Configuration lotteryState;
            numberOfTickets = 0;
            //delete tickets;
            delete ticketNumbers;
            delete winners;
            numberOfWinners = 0;
    }
}
