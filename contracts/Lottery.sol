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

    uint16 nrOfUsers = 3;

    struct State {
        bool open;
        uint8 round;
        uint64 maxNumber;
        uint256 ticketPrice;
        uint256 oracleCost;
    }

    struct Ticket {
        uint64 number;
        address payable sender;
        bytes32 hashedSecret;
    }

    constructor (uint64 maxNum, uint256 price, uint256 oracleCost, address oracleInstanceAddress) public {
        lotteryState = State(true, 0, maxNum, price, oracleCost);
        oracleAddress = oracleInstanceAddress;
    }

    function buyTicket (uint64 numberForTicket, bytes32 hashedSecret) public payable lotteryIsOpen() numberIsAllowed(numberForTicket){
        require(
            msg.value >= lotteryState.ticketPrice + lotteryState.oracleCost,
            "Not enough Ether provided."
        );
        if(numberOfTickets == 0) {
          startNewCampaign();
        }
        forwardSecret(hashedSecret);
        tickets[numberOfTickets++] = Ticket(numberForTicket, msg.sender, hashedSecret);
        totalPriceMoney = totalPriceMoney + lotteryState.ticketPrice;
        ticketNumbers.push(numberForTicket);
        //closeLotteryIfApplicable(5);
    }

    function startNewCampaign () private {
        Oracle(oracleAddress).startOrUpdateCampaign(nrOfUsers, nrOfUsers, lotteryState.oracleCost, 10);
    }

    function forwardSecret (bytes32 hashedSecret) private {
        Oracle(oracleAddress).commit.value(lotteryState.oracleCost)(hashedSecret, msg.sender);
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

    function payOut (uint256 winningNumber) private lotteryIsClosed() {
            if(numberOfWinners >= 1) {
                // one or more persons claimed the price -> pay them and reset the checkpot
                uint pricePerWinner = (totalPriceMoney) / numberOfWinners;
                for(uint winnerIndex = 0; winnerIndex < winners.length; winnerIndex++) {
                    // create transaction and send the price to each winner
                    winners[winnerIndex].transfer(pricePerWinner);
                }
                totalPriceMoney = 0;
            }
            emit LotteryEnd(winningNumber, winners, totalPriceMoney);
            // reset ticket purchases at the end of a lottery round
            resetTicketPurchases();
            lotteryState.open = true;
    }


    function closeLotteryIfApplicable (uint256 winningNumber) public {
        // TODO do this e.g. after N blocks
        //if(ticketNumbers.length == lotteryState.maxNumber && msg.sender == oracleAddress|| true) {
        if(ticketNumbers.length == nrOfUsers) {
          lotteryState.open = false;
          // check for the winners and pay them out
          computeWinners(winningNumber);
          payOut(winningNumber);
        }
    }

    event LotteryEnd(uint256 winningNumber, address payable[] winners, uint256 pot);

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

