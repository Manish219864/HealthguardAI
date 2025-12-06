// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InsuranceClaim {
    enum ClaimStatus { Submitted, UnderReview, Approved, Rejected }

    struct Claim {
        uint256 id;
        address patient;
        uint256 amount;
        string reason;
        string documentHash;
        ClaimStatus status;
        uint256 timestamp;
    }

    uint256 private nextClaimId = 1;
    mapping(uint256 => Claim) public claims;
    
    mapping(address => uint256[]) public userClaims;

    event ClaimSubmitted(uint256 indexed claimId, address indexed patient, uint256 amount);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus status);

    function submitClaim(uint256 _amount, string memory _reason, string memory _documentHash) public {
        claims[nextClaimId] = Claim({
            id: nextClaimId,
            patient: msg.sender,
            amount: _amount,
            reason: _reason,
            documentHash: _documentHash,
            status: ClaimStatus.Submitted,
            timestamp: block.timestamp
        });

        userClaims[msg.sender].push(nextClaimId);
        emit ClaimSubmitted(nextClaimId, msg.sender, _amount);
        nextClaimId++;
    }

    function updateClaimStatus(uint256 _claimId, ClaimStatus _status) public {
        require(_claimId < nextClaimId, "Claim does not exist");
        claims[_claimId].status = _status;
        emit ClaimStatusUpdated(_claimId, _status);
    }

    function getClaim(uint256 _claimId) public view returns (Claim memory) {
        return claims[_claimId];
    }
    
    function getUserClaims(address _user) public view returns (uint256[] memory) {
        return userClaims[_user];
    }
}
