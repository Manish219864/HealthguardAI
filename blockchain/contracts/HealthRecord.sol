// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HealthRecord {
    struct Record {
        string ipfsHash;
        string recordType;
        string fileName;
        uint256 dateAdded;
        address addedBy;
    }

    mapping(address => Record[]) private patientRecords;

    event RecordAdded(address indexed patient, string ipfsHash, string recordType, address addedBy);
    
    function addRecord(address _patient, string memory _ipfsHash, string memory _recordType, string memory _fileName) public {
        patientRecords[_patient].push(Record({
            ipfsHash: _ipfsHash,
            recordType: _recordType,
            fileName: _fileName,
            dateAdded: block.timestamp,
            addedBy: msg.sender
        }));

        emit RecordAdded(_patient, _ipfsHash, _recordType, msg.sender);
    }

    function getRecordCount(address _patient) public view returns (uint256) {
        return patientRecords[_patient].length;
    }

    function getRecord(address _patient, uint256 _index) public view returns (
        string memory ipfsHash,
        string memory recordType,
        string memory fileName,
        uint256 dateAdded,
        address addedBy
    ) {
        require(_index < patientRecords[_patient].length, "Record does not exist");
        Record memory record = patientRecords[_patient][_index];
        return (
            record.ipfsHash,
            record.recordType,
            record.fileName,
            record.dateAdded,
            record.addedBy
        );
    }
}
