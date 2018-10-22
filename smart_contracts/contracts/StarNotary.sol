pragma solidity ^0.4.23;


import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 

    struct Star { 
        string dec;
        string mag;
        string cent;
        string starStory;
    }

    mapping(uint256 => bool) public usedTokenIds;
    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string dec, string mag, string cent, string starStory) public { 
        require(this._checkIfStarExists(dec, mag, cent) == false, "Duplicate star");
        
        uint256 tokenId = this._getTokenIdFromStarDetails(dec, mag, cent);

        Star memory newStar = Star(dec, mag, cent, starStory);

        usedTokenIds[tokenId] = true;
        tokenIdToStarInfo[tokenId] = newStar;

        _mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender, "Sender does not own token");

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        // TODO Does star even exist
        require(starsForSale[_tokenId] > 0, "Star specified is not for sale");

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost, "Sender has insufficient funds");

        // Remove the token from the owner
        _removeTokenFrom(starOwner, _tokenId);
        // Add the token to the sender
        _addTokenTo(msg.sender, _tokenId);

        // Transfer of funds?
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // Helper methods
    function _checkIfStarExists(string dec, string mag, string cent) public view returns (bool) {
        uint256 tokenId = this._getTokenIdFromStarDetails(dec, mag, cent);
        return this._checkIfTokenExists(tokenId);
    }

    function _checkIfTokenExists(uint256 tokenId) public view returns (bool) {
        return usedTokenIds[tokenId];
    }

    function _starIsForSale(uint256 _tokenId) public view returns (bool) {
        return starsForSale[_tokenId] > 0;
    }

    function _getTokenIdFromStarDetails(string dec, string mag, string cent) public pure returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(dec, mag, cent)
            )
        );
    }
}
