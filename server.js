'use strict';

const Hapi = require('hapi');
const Vision = require('vision')
const Handlebars = require('handlebars')
const Web3 = require('web3')

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8001
});

// Default landing view which contains a form to fill out
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return h.view('index');
    }
});

// WORK IN PROGRESS STILL!
server.route({
    method: 'GET',
    path: '/star/{tokenId}',
    handler: async (request, h) => {
        var web3 = new Web3();
        web3 = new Web3(web3.currentProvider);
        const {
            tokenId
        } = request.params;
        // Confirm the param exists and there is only 1 colon
        if (!tokenId) {
            return {
                'error': 'Missing required tokenId'
            }
        }
        const StarNotary = web3.eth.Contract(
            [{
                    "constant": true,
                    "inputs": [{
                        "name": "interfaceId",
                        "type": "bytes4"
                    }],
                    "name": "supportsInterface",
                    "outputs": [{
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "name": "starsForSale",
                    "outputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "tokenId",
                        "type": "uint256"
                    }],
                    "name": "getApproved",
                    "outputs": [{
                        "name": "",
                        "type": "address"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "name": "starsTokenIdsForSale",
                    "outputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "transferFrom",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "name": "usedTokenIds",
                    "outputs": [{
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "tokenId",
                        "type": "uint256"
                    }],
                    "name": "ownerOf",
                    "outputs": [{
                        "name": "",
                        "type": "address"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "owner",
                        "type": "address"
                    }],
                    "name": "balanceOf",
                    "outputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "setApprovalForAll",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "name": "_data",
                            "type": "bytes"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "name": "operator",
                            "type": "address"
                        }
                    ],
                    "name": "isApprovedForAll",
                    "outputs": [{
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "anonymous": false,
                    "inputs": [{
                            "indexed": true,
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Transfer",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [{
                            "indexed": true,
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "approved",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Approval",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [{
                            "indexed": true,
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "ApprovalForAll",
                    "type": "event"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "dec",
                            "type": "string"
                        },
                        {
                            "name": "mag",
                            "type": "string"
                        },
                        {
                            "name": "cent",
                            "type": "string"
                        },
                        {
                            "name": "starStory",
                            "type": "string"
                        }
                    ],
                    "name": "createStar",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                            "name": "_tokenId",
                            "type": "uint256"
                        },
                        {
                            "name": "_price",
                            "type": "uint256"
                        }
                    ],
                    "name": "putStarUpForSale",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [{
                        "name": "_tokenId",
                        "type": "uint256"
                    }],
                    "name": "buyStar",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "_tokenId",
                        "type": "uint256"
                    }],
                    "name": "tokenIdToStarInfo",
                    "outputs": [{
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "_getStarsForSale",
                    "outputs": [{
                        "name": "",
                        "type": "uint256[]"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                            "name": "dec",
                            "type": "string"
                        },
                        {
                            "name": "mag",
                            "type": "string"
                        },
                        {
                            "name": "cent",
                            "type": "string"
                        }
                    ],
                    "name": "_checkIfStarExists",
                    "outputs": [{
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "tokenId",
                        "type": "uint256"
                    }],
                    "name": "_checkIfTokenExists",
                    "outputs": [{
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                        "name": "_tokenId",
                        "type": "uint256"
                    }],
                    "name": "_starIsForSale",
                    "outputs": [{
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [{
                            "name": "dec",
                            "type": "string"
                        },
                        {
                            "name": "mag",
                            "type": "string"
                        },
                        {
                            "name": "cent",
                            "type": "string"
                        }
                    ],
                    "name": "_getTokenIdFromStarDetails",
                    "outputs": [{
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "pure",
                    "type": "function"
                }
            ]
        );
        // Grab the contract at specified deployed address with the interface defined by the ABI
        const starNotary = StarNotary.at('0x9445D8994e09B38f31CC18D8458128FFCa7a345E');
        return {
            error: 'Internal error'
        };
    }
});

// Start the server
async function start() {
    await server.register({
        plugin: require('vision') // add template rendering support in hapi
    });

    // configure template support   
    server.views({
        engines: {
            html: Handlebars
        },
        path: __dirname + '/views',
        // Default path for route '/'
        layout: 'index'
    })

    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
