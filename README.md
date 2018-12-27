# Udacity - Blockchain Developer NanoDegree
## Project 5 - Decentralized Star Notary

In this project, a DApp is created by adding functionality to smart contract and deploy it on the public testnet (rinkeby). To do so, I have employed my blockchain identity to secure digital assets on the Ethereum platform using a smart contract. This project gave me a chance to practice my knowledge of the basics of Solidity.
This project demonstrates the importance of notarizing digital assets (e.g. documents, media files, etc.) which uses the concept of 'Proof of Existence' to prove the digital asset is authentic and can be trusted. In additional, it can also prove ownership of the digital asset if that information is provided.

## Project Learnings
This project helped to apply various concepts and skills gained throughout the Term 1 of Blockchain Developer Nanodegree. Key learnings of this projects are:

- Write a smart contract with functions that support of proof of existence (also known as notarization)
- Test smart contract code coverage
- Deploy smart contract on a public test networks (e.g. Rinkeby)
- Utilize javascript to modify client side code to interact with a smart contract
- Understand the difference between fungible and non-fungible tokens
- Understand the difference between ERC-20 and ERC-721 standards

## Project Details
The entire project can be divided into 4 sub-tasks:
| Part                | Subtask                     |
| ------------------- | --------------------------- |
| **Part 1**          | Write a smart contract with functions to support proof of existence (i.e. notarization)         |
| **Part 2**          | Test smart contract code coverage        |
| **Part 3**          | Deploy smart contract on a public test network (Rinkeby) |
| **Part 4**          | Modify client code to interact with a smart contract  |

### Subtask 1 : Write a Smart Contract
- Create a Smart Contract that support proof of existence
- The Smart Contract implements ERC-721 interface
- Adds metadata to Star token
- Configures uniqueness with the stars
- Contains required functions

### Subtask 2 : Test Smart Contract
- Uses Unit Tests framework of Truffle
- Unit tests are testing functionality of Smart Contract as well as ERC-721 Interface

### Subtask 3 : Deploy Smart Contract on a Public Test Network (Rinkeby)
- Using Truffle framework, Smart Contract is deployed on the Rinkeby test network
- Below items are proof of this Subtask achievement:
#### Contract Address on Rinkeby:
```
0x397978d2f692be3987134a4ab2bf42db0c6417e8
(https://rinkeby.etherscan.io/address/0x397978d2f692be3987134a4ab2bf42db0c6417e8)
```

#### Contract Creation Hash:
```
0x67f88fe6d0d9bb01c93c06be8b0a16e2be47eed1e7e486cd393d23f0294971a4
(https://rinkeby.etherscan.io/tx/0x67f88fe6d0d9bb01c93c06be8b0a16e2be47eed1e7e486cd393d23f0294971a4)
```

#### Contract Overview:
```
0x992eaea1843fea0a84ef3ecfa3fb21f9064a4ee4
(https://rinkeby.etherscan.io/address/0x992eaea1843fea0a84ef3ecfa3fb21f9064a4ee4)
```

#### Transaction Hash of createStar():
```
0x663be6ef08c3a5dbe3fa307e3039a0e6c8c8a98ee17ec87d627dbe819b02f37b
(https://rinkeby.etherscan.io/tx/0x663be6ef08c3a5dbe3fa307e3039a0e6c8c8a98ee17ec87d627dbe819b02f37b)
```
#### Star Tokenid:
```
101
```

### Subtask 4 : Modify client code to interact with a smart contract
This is a web-page that lets user interact with contract by allowing user to claim and register a star, search a star based on token id and put an existing star for sale.

## Putting all the pieces together to get a hands on experience
Once all 4 tasks are completed, anyone can use this project to get a hands-on experience. However, there are few things that need to happen before running this project. Below is the explanation of these items.

### Requirements
One has to get familiar with following items in order to run this project.

* [node.js - javascript runtime](https://nodejs.org/en/)
* IDE  - One can use simple text editors to browse through code. However, a good IDE can help navigate code efficiently. One can use Sublime, Notepad++ to go through source-code. However I personally prefer [VS Code](https://code.visualstudio.com/)
* [Truffle](https://truffleframework.com/) - A Smart Contract Test Environment
* [Ganache](https://truffleframework.com/ganache) - Local ethereum blockchain for testing
* [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity) - A library for secure smart contract development
* [web3.js](https://web3js.readthedocs.io/en/1.0/) - A collection of libraries which allow you to interact with a local or remote ethereum node
* [Infura](https://infura.io) - A suite of tools to connect their apps to the Ethereum network and other decentralized platforms
* [MetaMask](https://metamask.io) - A bridge that allows you to visit the distributed web of tomorrow in your browser today. It allows you to run Ethereum dApps right in your browser without running a full Ethereum node.
* [Solidity](https://solidity.readthedocs.io/en/v0.4.24/) - A contract-oriented, high-level language for implementing smart contracts.

### Running the project
* Once entire project is copied to local machine, follow the below steps:
1. Install node.js
2. Run *Ganache*. It has command line interface as well as GUI. You can choose any flavor of your choice.
3. Navigate to the project directory
4. Run "npm install" command. This would take care of installing all the required components.
5. Run "truffle.cmd compile" command
   5.1 Note that, when you run the Ganace in GUI, usually it runs on 127.0.0.1:7545. The "truffle-config.js" file already has this value under "development" network. However, based on your configuration, this may change. Please change those value accordingly.
6. Run "truffle.cmd migrate" command
If everything is fine till this point, you are all set to test the contract functionality.
7. Navigate to "portal" directory
8. Run the local server on your machine and make note of IP address and port number of server (This is one of the items I mentioned in "Requirements" section.
9. Open browser of your choice and navigate to "localhost:<port>/index.html"

**P.S. : If you check the truffle-config.js file, it has 2 constants, "mnemonic" and "rinkebyEndpoint". Please make sure you update these 2 variables with appropriate values. 
You can find the mnemonic of your account from MetaMask -> Settingss -> Reveal Seed Words and rinkebyEndPoint from Infura web-console**