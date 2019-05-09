pragma solidity ^0.5.0;

contract Oracle_Simple {

    constructor () public payable{

    }

    function getRandom(uint16 mod) external view returns (uint256) {
       return uint256(keccak256(abi.encodePacked(blockhash(block.number),keccak256(abi.encodePacked(block.difficulty)))))%mod;
    }
}
