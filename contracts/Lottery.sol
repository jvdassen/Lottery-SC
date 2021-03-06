pragma solidity ^0.5.0;

import {Oracle} from './Oracle.sol';

contract Lottery {
    State lotteryState;
    uint64 numberOfTickets = 0;
    uint256 totalPriceMoney = 0;
    mapping (uint => Ticket) tickets;
    uint64[] ticketNumbers;
    address payable[] winners;
    uint256 numberOfWinners = 0;
    address oracleAddress;
    uint16 oracleModulo;

    uint16 nrOfSecrets = 3;

    struct State {
        bool open;
        uint64 maxNumber;
        uint256 ticketPrice;
        uint256 oracleCost;
    }

    struct Ticket {
        uint64 number;
        address payable sender;
    }

    // actually correct would be to remove the parameter maxNumber and just take modulo - 1 there, 
    // but because of the test cases we need to have the possibility to adapt it there
    constructor (uint64 maxNum, uint256 price, uint256 oracleCost, address oracleInstanceAddress, uint16 modulo) public {
        lotteryState = State(true, maxNum, price, oracleCost);
        oracleAddress = oracleInstanceAddress;
	oracleModulo = modulo;
    }

    function buyTicket (uint64 numberForTicket, bytes32 hashedSecret) public payable lotteryIsOpen() numberIsAllowed(numberForTicket){
        require(
            msg.value >= lotteryState.ticketPrice + lotteryState.oracleCost,
            "Not enough Ether provided."
        );
        if(numberOfTickets == 0) {
          startNewOracle();
        }
        forwardSecret(hashedSecret);
        tickets[numberOfTickets++] = Ticket(numberForTicket, msg.sender);
        totalPriceMoney = totalPriceMoney + lotteryState.ticketPrice;
        ticketNumbers.push(numberForTicket);
    }
    
    function buyCommitfreeTicket (uint64 numberForTicket) public payable lotteryIsOpen() numberIsAllowed(numberForTicket){
        require(
            msg.value >= lotteryState.ticketPrice,
            "Not enough Ether provided."
        );
        // it is possible to submit no secret for a user
        if(numberOfTickets == 0) {
          startNewOracle();
        }
        tickets[numberOfTickets++] = Ticket(numberForTicket, msg.sender);
        totalPriceMoney = totalPriceMoney + lotteryState.ticketPrice;
        ticketNumbers.push(numberForTicket);
    }

    function startNewOracle () private {
        Oracle(oracleAddress).initializeOracleState(nrOfSecrets, lotteryState.oracleCost, oracleModulo);
    }

    function forwardSecret (bytes32 hashedSecret) private {
        Oracle(oracleAddress).commit.value(lotteryState.oracleCost)(hashedSecret, msg.sender);
    }

    function computeWinners (uint256 lotteryResult) private {
        for (uint64 ticketIndex = 0; ticketIndex < numberOfTickets; ticketIndex++) {
            if(tickets[ticketIndex].number == lotteryResult) {
                winners.push(tickets[ticketIndex].sender);
            }
        }
        numberOfWinners = winners.length;
    }

    function payOut (uint256 winningNumber) private lotteryIsClosed() {
            if(numberOfWinners >= 1) {
                // one or more persons claimed the price -> pay them and reset the checkpot
                uint pricePerWinner = (totalPriceMoney) / numberOfWinners;
                emit LotteryEnd(winningNumber, winners, 0, pricePerWinner - lotteryState.ticketPrice);
                for(uint winnerIndex = 0; winnerIndex < winners.length; winnerIndex++) {
                    // create transaction and send the price to each winner
                    winners[winnerIndex].transfer(pricePerWinner);
                }
                totalPriceMoney = 0;
            } else {
              emit LotteryEnd(winningNumber, winners, totalPriceMoney, 0);
            }
            // reset ticket purchases at the end of a lottery round
            resetTicketPurchases();
            lotteryState.open = true;
    }


    function closeLotteryIfApplicable (uint256 winningNumber) public {
        require(
            msg.sender == oracleAddress,
            "Only Oracle can repay the ticket prices."
        );
        lotteryState.open = false;
        // check for the winners and pay them out
        computeWinners(winningNumber);
        payOut(winningNumber);
    }

    event LotteryEnd(uint256 winningNumber, address payable[] winners, uint256 pot, uint pricePerWinner);

    function returnTicketPrices() public {
        //return ticket costs of this round
        require(
            msg.sender == oracleAddress,
            "Only Oracle can repay the ticket prices."
        );
        for(uint i = 0; i < numberOfTickets; i++) {
                tickets[i].sender.transfer(lotteryState.ticketPrice);
                totalPriceMoney = totalPriceMoney - lotteryState.ticketPrice;
        }
        //reset the ticket purchases, since a new lottery will start
        resetTicketPurchases();
    }

    function resetTicketPurchases () private {
            //delete tickets
            for(uint64 i = 0; i < numberOfTickets; i++){
                delete tickets[numberOfTickets];
            }
            //Configuration lotteryState;
            numberOfTickets = 0;
            delete ticketNumbers;
            delete winners;
            numberOfWinners = 0;
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

