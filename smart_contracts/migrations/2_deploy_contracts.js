var StarNotary = artifacts.require("../contracts/StarNotary.sol");

module.exports = (deployer) => {
    deployer.deploy(StarNotary);
}
