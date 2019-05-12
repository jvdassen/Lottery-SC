pragma solidity ^0.5.0;

import {Oracle_Simple} from './Oracle_Simple.sol';

contract Lottery {
    State lotteryState;
    uint64 numberOfTickets = 0;
    uint256 totalPriceMoney = 0;
    mapping (uint => Ticket) tickets;
    uint64[] ticketNumbers;
    address payable[] winners;
    uint256 numberOfWinners = 0;
    Oracle_Simple oracle;
    
    struct State {
        bool open;
        uint8 round;
        uint64 maxNumber;
        uint256 ticketPrice;
    }
     
    struct Ticket {
        uint64 number;
        address payable sender;
    }
    
    constructor (uint64 maxNum, uint256 price, address oracleAddress) public {
        lotteryState = State(true, 0, maxNum, price);
        oracle = Oracle_Simple(oracleAddress);
        //closeLotteryAtSomePointInTime();
    }
    
    function buyTicket (uint64 numberForTicket) public payable lotteryIsOpen() numberIsAllowed(numberForTicket){
        require(
            msg.value >= lotteryState.ticketPrice,
            "Not enough Ether provided."
        );
        tickets[numberOfTickets++] = Ticket(numberForTicket, msg.sender);
        totalPriceMoney = totalPriceMoney + lotteryState.ticketPrice;
        ticketNumbers.push(numberForTicket);
        //closeLotteryAtSomePointInTime();
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
    
    function computeWinners (uint256 lotteryResult) private {
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
                    winners[winnerIndex].transfer(pricePerWinner);
                }
                totalPriceMoney = 0; resetLotteryCompletely(); }
            lotteryState.open = true;
    }

  	event LogNumber(uint256 winningNumber);
    
    function resetLotteryCompletely () private lotteryIsClosed() {
        resetTicketPurchases();
        resetLotteryState();
    }
    
    function resetLotteryState () private {

    }
    
    function queryLotteryNumberFromOracle () private {
        
    }
    
    function closeLotteryAtSomePointInTime () public {
        // TODO do this e.g. after N blocks
        lotteryState.open = false;
        // TODO: input variable should be random computed with the oracle of compute winners
        if(true) {
          uint256 winningNumber = oracle.getRandom(1);
          emit LogNumber(winningNumber);
          computeWinners(winningNumber);
          payOut();
        }
    }
    
    function resetTicketPurchases () private {
            //Configuration lotteryState;
            //delete tickets
            for(uint64 i = 0; i < numberOfTickets; i++){
                delete tickets[numberOfTickets];
            }
            numberOfTickets = 0;
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
        /*if (msg.value > _amount)
            msg.sender.transfer(msg.value - _amount);*/
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

