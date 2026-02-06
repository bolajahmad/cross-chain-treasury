export const TokenReceiverContractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_fee",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_h",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnauthorizedCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnexpectedCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "action",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "body",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "commitmentId",
          "type": "bytes32"
        }
      ],
      "name": "DepositIntent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "action",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "func",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "gas",
          "type": "uint256"
        }
      ],
      "name": "Log",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "action",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Refunded",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "currentNetwork",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "actionType",
          "type": "uint8"
        },
        {
          "internalType": "bytes",
          "name": "action",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "toContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "escrows",
      "outputs": [
        {
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "released",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "enum TokenReceiver.EscrowStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "host",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "lockedBalances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "network",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "bytes",
                  "name": "source",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "dest",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "nonce",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "from",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "to",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "timeoutTimestamp",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "body",
                  "type": "bytes"
                }
              ],
              "internalType": "struct PostRequest",
              "name": "request",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "relayer",
              "type": "address"
            }
          ],
          "internalType": "struct IncomingPostRequest",
          "name": "incoming",
          "type": "tuple"
        }
      ],
      "name": "onAccept",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "components": [
                    {
                      "internalType": "bytes",
                      "name": "source",
                      "type": "bytes"
                    },
                    {
                      "internalType": "bytes",
                      "name": "dest",
                      "type": "bytes"
                    },
                    {
                      "internalType": "uint64",
                      "name": "nonce",
                      "type": "uint64"
                    },
                    {
                      "internalType": "address",
                      "name": "from",
                      "type": "address"
                    },
                    {
                      "internalType": "uint64",
                      "name": "timeoutTimestamp",
                      "type": "uint64"
                    },
                    {
                      "internalType": "bytes[]",
                      "name": "keys",
                      "type": "bytes[]"
                    },
                    {
                      "internalType": "uint64",
                      "name": "height",
                      "type": "uint64"
                    },
                    {
                      "internalType": "bytes",
                      "name": "context",
                      "type": "bytes"
                    }
                  ],
                  "internalType": "struct GetRequest",
                  "name": "request",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "bytes",
                      "name": "key",
                      "type": "bytes"
                    },
                    {
                      "internalType": "bytes",
                      "name": "value",
                      "type": "bytes"
                    }
                  ],
                  "internalType": "struct StorageValue[]",
                  "name": "values",
                  "type": "tuple[]"
                }
              ],
              "internalType": "struct GetResponse",
              "name": "response",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "relayer",
              "type": "address"
            }
          ],
          "internalType": "struct IncomingGetResponse",
          "name": "",
          "type": "tuple"
        }
      ],
      "name": "onGetResponse",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "source",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "dest",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "nonce",
              "type": "uint64"
            },
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "timeoutTimestamp",
              "type": "uint64"
            },
            {
              "internalType": "bytes[]",
              "name": "keys",
              "type": "bytes[]"
            },
            {
              "internalType": "uint64",
              "name": "height",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "context",
              "type": "bytes"
            }
          ],
          "internalType": "struct GetRequest",
          "name": "",
          "type": "tuple"
        }
      ],
      "name": "onGetTimeout",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "source",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "dest",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "nonce",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "from",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "to",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "timeoutTimestamp",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "body",
              "type": "bytes"
            }
          ],
          "internalType": "struct PostRequest",
          "name": "",
          "type": "tuple"
        }
      ],
      "name": "onPostRequestTimeout",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "components": [
                    {
                      "internalType": "bytes",
                      "name": "source",
                      "type": "bytes"
                    },
                    {
                      "internalType": "bytes",
                      "name": "dest",
                      "type": "bytes"
                    },
                    {
                      "internalType": "uint64",
                      "name": "nonce",
                      "type": "uint64"
                    },
                    {
                      "internalType": "bytes",
                      "name": "from",
                      "type": "bytes"
                    },
                    {
                      "internalType": "bytes",
                      "name": "to",
                      "type": "bytes"
                    },
                    {
                      "internalType": "uint64",
                      "name": "timeoutTimestamp",
                      "type": "uint64"
                    },
                    {
                      "internalType": "bytes",
                      "name": "body",
                      "type": "bytes"
                    }
                  ],
                  "internalType": "struct PostRequest",
                  "name": "request",
                  "type": "tuple"
                },
                {
                  "internalType": "bytes",
                  "name": "response",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "timeoutTimestamp",
                  "type": "uint64"
                }
              ],
              "internalType": "struct PostResponse",
              "name": "response",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "relayer",
              "type": "address"
            }
          ],
          "internalType": "struct IncomingPostResponse",
          "name": "",
          "type": "tuple"
        }
      ],
      "name": "onPostResponse",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "bytes",
                  "name": "source",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "dest",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "nonce",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "from",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "to",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "timeoutTimestamp",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "body",
                  "type": "bytes"
                }
              ],
              "internalType": "struct PostRequest",
              "name": "request",
              "type": "tuple"
            },
            {
              "internalType": "bytes",
              "name": "response",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "timeoutTimestamp",
              "type": "uint64"
            }
          ],
          "internalType": "struct PostResponse",
          "name": "",
          "type": "tuple"
        }
      ],
      "name": "onPostResponseTimeout",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "dest",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "to",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "body",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "timeout",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "payer",
              "type": "address"
            }
          ],
          "internalType": "struct DispatchPost",
          "name": "request",
          "type": "tuple"
        }
      ],
      "name": "quote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "dest",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "height",
              "type": "uint64"
            },
            {
              "internalType": "bytes[]",
              "name": "keys",
              "type": "bytes[]"
            },
            {
              "internalType": "uint64",
              "name": "timeout",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "context",
              "type": "bytes"
            }
          ],
          "internalType": "struct DispatchGet",
          "name": "request",
          "type": "tuple"
        }
      ],
      "name": "quote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "bytes",
                  "name": "source",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "dest",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "nonce",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "from",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "to",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "timeoutTimestamp",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "body",
                  "type": "bytes"
                }
              ],
              "internalType": "struct PostRequest",
              "name": "request",
              "type": "tuple"
            },
            {
              "internalType": "bytes",
              "name": "response",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "timeout",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "payer",
              "type": "address"
            }
          ],
          "internalType": "struct DispatchPostResponse",
          "name": "response",
          "type": "tuple"
        }
      ],
      "name": "quote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "dest",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "to",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "body",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "timeout",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "payer",
              "type": "address"
            }
          ],
          "internalType": "struct DispatchPost",
          "name": "request",
          "type": "tuple"
        }
      ],
      "name": "quoteNative",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "bytes",
                  "name": "source",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "dest",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "nonce",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "from",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "to",
                  "type": "bytes"
                },
                {
                  "internalType": "uint64",
                  "name": "timeoutTimestamp",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes",
                  "name": "body",
                  "type": "bytes"
                }
              ],
              "internalType": "struct PostRequest",
              "name": "request",
              "type": "tuple"
            },
            {
              "internalType": "bytes",
              "name": "response",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "timeout",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "payer",
              "type": "address"
            }
          ],
          "internalType": "struct DispatchPostResponse",
          "name": "request",
          "type": "tuple"
        }
      ],
      "name": "quoteNative",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "dest",
              "type": "bytes"
            },
            {
              "internalType": "uint64",
              "name": "height",
              "type": "uint64"
            },
            {
              "internalType": "bytes[]",
              "name": "keys",
              "type": "bytes[]"
            },
            {
              "internalType": "uint64",
              "name": "timeout",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "context",
              "type": "bytes"
            }
          ],
          "internalType": "struct DispatchGet",
          "name": "request",
          "type": "tuple"
        }
      ],
      "name": "quoteNative",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "sentMessages",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_network",
          "type": "uint256"
        }
      ],
      "name": "updateNetworkId",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]