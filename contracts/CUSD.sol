// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/** Mock CUSD contract */
contract CUSD is ERC20 {
    constructor() ERC20("Celo Dollar", "CUSD") {}

    /** Assigns new tokens to receiver */
    function credit(address receiver, uint256 amount) public {
        _mint(receiver, amount);
    }
}
