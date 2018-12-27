pragma solidity ^0.4.23;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 

    struct Star { 
        string name; 
        string story;
        string coord_dec;
        string coord_mag;
        string coord_cent;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => uint256) public existingStars;

    function createStar(string _name, string _starStory, string _ra, string _dec, string _mag, uint256 _tokenId) public { 
        bytes32 KeccakHash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        require(existingStars[KeccakHash] == 0, "Star already exists");

        Star memory newStar = Star(_name, _starStory, _ra, _dec, _mag);
        tokenIdToStarInfo[_tokenId] = newStar;
        existingStars[KeccakHash] = _tokenId;
        mint(_tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender, "You are not owner of the star you are traying to sale.");

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0, "The star you are trying to buy is not up for sale.");
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost, "You do not have sufficient fund to buy the star.");

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns (bool) {
        bytes32 KeccakHash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        return existingStars[KeccakHash] != 0;
    }

    function mint(uint256 _tokenId) public {
        ERC721._mint(msg.sender, _tokenId);
    }
}