<template lang="html">
  <div class="main-container">
    <div class="title">
      Smart Contract Lottery
    </div>
    <div class="status">
    </div>
    <div v-for="account in accounts" v-bind:key="account.hash" class="account">
      <div class="account-hash account-content">
        {{ account.hash }}
      </div>
      <div class="number-input account-content">
        <input v-model="account.number" class="number" type="text" name="" placeholder="Number">
      </div>
      <div class="secret-input account-content">
        <input v-model="account.secret" class="secret" type="password" name="" placeholder="Secret">
      </div>
      <div class="account-content">
        <button @click="buyTicket(account)" class="buy-button" type="button" name="button">Buy Ticket</button>
        <button @click="reveal(account)" class="buy-button" type="button" name="button">Reveal</button>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import keccak from 'keccak'
import LotteryJSON from '../../../build/contracts/Lottery.json'
import OracleJSON from '../../../build/contracts/Oracle.json'

var lotteryContract;
var oracleContract;
var web3;

export default {
  data: function() {
    return {
      rawAccounts: [],
      accounts: [{
        hash: "",
        number: Number,
        secret: ""
      }],
      status: {},
      balances: [],
      newOracle: {}
    }
  },
  mounted: function () {
    web3 = new Web3('ws://127.0.0.1:7545');

    lotteryContract = new web3.eth.Contract(LotteryJSON.abi, "0xeBc782918cBC69fe6C00912596Af7d72C892aF07");
    oracleContract = new web3.eth.Contract(OracleJSON.abi, "0x9c768F53B2a61753754B07209c67A983FF42515A");

    oracleContract.getPastEvents("allEvents", {
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, event) => { console.log(event); console.log(error);})
    .then((events) => {
    console.log(events) // same results as the optional callback above
});
    this.getAccounts()
  },
  methods: {
    getAccounts: async function () {
      this.rawAccounts = await web3.eth.getAccounts()
    },
    buyTicket: async function (account) {
      if (account.secret === "") {
        lotteryContract.methods.buyCommitfreeTicket(account.number).send({from: account.hash, value: web3.utils.toWei('1.0', "ether")})
        .on('transactionHash', (hash) => {
            console.log(hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log(confirmationNumber);
            console.log(receipt);
        })
        .on('receipt', (receipt) => {
            // receipt example
            console.log(receipt);
        })
        .on('error', console.error); // If there's an out of gas error the second parameter is the receipt.
      } else {
        let hashedSecret = '0x' + keccak('keccak256').update(account.secret).digest('hex');
        console.log("bought ticket from account " + account.hash + " and number " + account.number + "and secret " + hashedSecret);

        lotteryContract.methods.buyTicket(account.number, hashedSecret).send({from: account.hash, value: web3.utils.toWei('1.0', "ether")})
        .on('transactionHash', (hash) => {
            console.log(hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log(confirmationNumber);
            console.log(receipt);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
        })
        .on('error', console.error); // If there's an out of gas error the second parameter is the receipt.
      }
    },
    reveal: function (account) {
      oracleContract.methods.reveal(account.secret).send({from: account.hash})
      .on('transactionHash', (hash) => {
          console.log(hash);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
          console.log(confirmationNumber);
          console.log(receipt);
      })
      .on('receipt', (receipt) => {
          console.log(receipt);
      })
      .on('error', console.error); // If there's an out of gas error the second parameter is the receipt.
    }
  },
  watch: {
    rawAccounts: function () {
      this.accounts = this.rawAccounts.map(accountHash => ({hash: accountHash, number: "", secret: ""}))
    }
  }
}
</script>

<style lang="css">
.main-container {
  font-family: monospace;
  font-size: 18px;
  background-color: #dddddd;
  width: 90%;
  height: 100%;
  margin: auto;
}

.title {
  font-size: 27px;
  padding-top: 10px;
}
.account {
  padding: 10px;
  background-color: #bbbbbb;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buy-button {
  color: white;
  background-color: #222222;
  border: none;
  height: 30px;
  width: 100px;
}



</style>
