# Lottery Smart Contract

> Lottery that is fully playable on ethereum. It contains two parts; a Lottery and an Oracle that allows number generation through a commit-reveal algorithm.

## Development
We have developed & tested usig the Truffle suite. We have agreed to use the following versions:

- Truffle v5.0.18 (core: 5.0.18)
- Solidity v0.5.0 (solc-js)
- Node v11.14.0
- Web3.js v1.0.0-beta.37
- Ganache v1.3.1

## Local setup

Install Ganache (v1.3.1):
```
curl -LO https://github.com/trufflesuite/ganache/archive/v1.3.1.zip
unzip v1.3.1.zip
cd v1.3.1
npm install; npm start
```

Install truffle (v5.0.18)
```
sudo npm install -g truffle@5.0.18
```

## Test
```
truffle test
```

## Deployment
The lottery offers quite a bit of flexibility, for example one may specify the range of numbers that are considered for number generation.
Consider the following parameters before deploying:
- `price` of the ticket
- `cost` of the oracle
- `oracleModulo`, threshold for the random umber generation.
