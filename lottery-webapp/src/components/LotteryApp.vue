<template lang="html">
  <div class="main-container">
    <div class="title">
      Smart Contract Lottery
    </div>
    <div class="status">
    </div>
    <div v-for="(account, index) in accounts" v-bind:key="account.hash" class="account">
      <div class="account-hash account-content">
        {{ account.hash }}
      </div>
      <div class="number-input account-content">
        <input v-model="account.number" class="number" type="number" name="" placeholder="Number">
      </div>
      <div class="secret-input account-content">
        <input v-model="account.secret" class="secret" type="password" name="" placeholder="Secret">
      </div>
      <div class="account-content">
        <button @click="buyTicket(account, index)" :class="{disabled: account.number == ''}" class="buy-button" type="button" name="button">Buy Ticket</button>
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
      }],
      status: {},
      balances: [],
      newOracle: {}
    }
  },
  mounted: function () {
    web3 = new Web3('ws://127.0.0.1:7545');

    oracleContract = new web3.eth.Contract(OracleJSON.abi, "0xC7773C67477A195520eA96e27d3ab0bf7d7fFe91");
    lotteryContract = new web3.eth.Contract(LotteryJSON.abi, "0xc52Ea7931C6EFBe0b8096dd0cf1030e1ACA697b7");

    oracleContract.events.allEvents({
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, event) => { console.log(event); console.log(error);})

    this.getAccounts()
  },
  methods: {
    getAccounts: async function () {
      this.rawAccounts = await web3.eth.getAccounts()
    },
    buyTicket: async function (account, index) {
      if (account.secret === "") {

        lotteryContract.methods.buyCommitfreeTicket(account.number).send({from: account.hash, value: web3.utils.toWei('3.0', "ether")})
        .on('error', console.error);

      } else {
        let hashedSecret = '0x' + keccak('keccak256').update(account.secret).digest('hex');

        lotteryContract.methods.buyTicket(account.number, hashedSecret).send({from: account.hash, value: web3.utils.toWei('4.0', "ether")})
        .on('error', console.error);
      }
    },
    reveal: function (account) {
      oracleContract.methods.reveal(account.secret).send({from: account.hash})
      .on('error', console.error);
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
  margin-right: 10px;
}

.disabled {
  color: grey;
  background-color: #aaaaaa;
}
</style>
