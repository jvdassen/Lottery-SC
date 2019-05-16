<template lang="html">
  <div class="main-container">
    <div class="title">
      Smart Contract Lottery
    </div>
    <div class="status">
    </div>
    <div v-for="account in accounts" v-bind:key="account" class="account">
      <div class="account-hash account-content">
        {{ account }}
      </div>
      <div class="number-input account-content">
        <input class="number" type="text" name="" placeholder="Number">
      </div>
      <div class="secret-input account-content">
        <input class="secret" type="password" name="" placeholder="Secret">
      </div>
      <div class="account-content">
        <button @click="buyTicket" class="buy-button" type="button" name="button">Buy Ticket</button>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  data: function() {
    return {
      web3: new Web3,
      accounts: [],
      status: {},
      balances: []
    }
  },
  mounted: function () {
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

    this.getAccounts()
  },
  methods: {
    getAccounts: async function () {
      this.accounts = await this.web3.eth.getAccounts()
    },
    buyTicket: async function () {

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
