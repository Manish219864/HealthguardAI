// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ConsentManager {
    mapping(address => mapping(address => bool)) private accessRegistry;
    
    event AccessGranted(address indexed patient, address indexed agent, uint256 timestamp);
    event AccessRevoked(address indexed patient, address indexed agent, uint256 timestamp);

    function grantAccess(address _agent) public {
        accessRegistry[msg.sender][_agent] = true;
        emit AccessGranted(msg.sender, _agent, block.timestamp);
    }

    function revokeAccess(address _agent) public {
        accessRegistry[msg.sender][_agent] = false;
        emit AccessRevoked(msg.sender, _agent, block.timestamp);
    }

    function checkAccess(address _patient, address _agent) public view returns (bool) {
        if (_patient == _agent) {
            return true;
        }
        return accessRegistry[_patient][_agent];
    }
}
