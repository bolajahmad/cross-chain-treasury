export const TreasuryContractABI = [
  {
    "type": "constructor",
    "name": "",
    "constant": false,
    "anonymous": false,
    "stateMutability": "",
    "inputs": [
      {
        "name": "_maxActions",
        "type": "uint256",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      }
    ],
    "outputs": null
  },
  {
    "type": "function",
    "name": "actionCount",
    "constant": false,
    "anonymous": false,
    "stateMutability": "view",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      }
    ]
  },
  {
    "type": "function",
    "name": "actions",
    "constant": false,
    "anonymous": false,
    "stateMutability": "view",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ],
    "outputs": [
      {
        "name": "status",
        "type": "uint8",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "actionType",
        "type": "uint8",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "exists",
        "type": "bool",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bool"
        }
      },
      {
        "name": "executedAt",
        "type": "uint256",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "dataHash",
        "type": "bytes",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ]
  },
  {
    "type": "function",
    "name": "maxActions",
    "constant": false,
    "anonymous": false,
    "stateMutability": "view",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      }
    ]
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "constant": false,
    "anonymous": false,
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "createAction",
    "constant": false,
    "anonymous": false,
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      },
      {
        "name": "_type",
        "type": "uint8",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "_params",
        "type": "bytes",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "owner",
    "constant": false,
    "anonymous": false,
    "stateMutability": "view",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "address"
        }
      }
    ]
  },
  {
    "type": "function",
    "name": "executeTreasuryAction",
    "constant": false,
    "anonymous": false,
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "generateActionId",
    "constant": false,
    "anonymous": false,
    "stateMutability": "view",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ]
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "constant": false,
    "anonymous": false,
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "address"
        }
      }
    ],
    "outputs": []
  },
  {
    "type": "event",
    "name": "ActionCreated",
    "constant": false,
    "anonymous": false,
    "stateMutability": "",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": true,
        "simple_type": {
          "type": "bytes"
        }
      },
      {
        "name": "actionType",
        "type": "uint8",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "params",
        "type": "bytes",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ],
    "outputs": null
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "constant": false,
    "anonymous": false,
    "stateMutability": "",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": true,
        "simple_type": {
          "type": "address"
        }
      },
      {
        "name": "newOwner",
        "type": "address",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": true,
        "simple_type": {
          "type": "address"
        }
      }
    ],
    "outputs": null
  },
  {
    "type": "event",
    "name": "TreasuryExecution",
    "constant": false,
    "anonymous": false,
    "stateMutability": "",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": true,
        "simple_type": {
          "type": "bytes"
        }
      },
      {
        "name": "actionType",
        "type": "uint8",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "amount",
        "type": "uint256",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "uint"
        }
      },
      {
        "name": "params",
        "type": "bytes",
        "storage_location": "default",
        "offset": 0,
        "index": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "indexed": false,
        "simple_type": {
          "type": "bytes"
        }
      }
    ],
    "outputs": null
  }
] as const;
