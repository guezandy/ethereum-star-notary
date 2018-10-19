const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {
    // Where do these accounts come from? Truffle I think
    var defaultAccount = accounts[0]
    var user1 = accounts[1]
    var user2 = accounts[2]
    var operator = accounts[3]

    let contract;

    beforeEach(async () => {
        // Create the token contract
        // console.log(StarNotary);
        contract = await StarNotary.new({
            from: defaultAccount
        });
    });

    describe('Create a star', () => {
        it('mints a star and assigns the owner', async () => {
            await contract.createStar('Test star', 1, {from: user1});
            assert(await contract.ownerOf(1), user1);
        });

        it('adding a token for a user will increment there account balance', async () => {
            await contract.createStar('Test star', 1, {from: user1});
            const balance = await contract.balanceOf(user1);
            assert(balance.toNumber(), 1);
        });

        it('emits the correct event during creation of a new token', async () => {
            const tx = await contract.createStar('Test star', 1, {from: user1});
            assert.equal(tx.logs[0].event, 'Transfer');
        });
    });

    describe('Can put star up for sale', () => {
        beforeEach( async () => {
            const tx = await contract.createStar('Test star', 1, { from: user1 });
        });
        it('Cannot sell token you do not own', async () => {
            try {
                await contract.putStarUpForSale(1, 12, {from: user2});
                assert.fail();
            } catch(e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert');
            }
        });

        it('Puts a token for sale', async() => {
            await contract.putStarUpForSale(1, 12, {from: user1});
            assert.equal(await contract.starIsForSale(1), true);
        });

        it('Sets price correctly for token for sale', async () => {
            await contract.putStarUpForSale(1, 12, {from: user1});
            assert.equal(await contract.starsForSale(1), 12);
        });
    });

    describe('A user can purchase a star this is for sale', () => {
        beforeEach(async () => {
            const tx = await contract.createStar('Test star', 1, {
                from: user1
            });
            const starPrice = web3.toWei(.05, 'ether');
            await contract.putStarUpForSale(1, starPrice, {
                from: user1
            });
        });
        it.only('funds move correctly', async () => {
            const starPrice = web3.toWei(.05, 'ether');
            let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1);
            let balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2);
            await contract.buyStar(1, {from: user2, value: starPrice});
            let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1);
            let balanceOfUser2AfterTransaction = web3.eth.getBalance(user2);
            console.log(balanceOfUser2BeforeTransaction.toNumber());
            console.log(balanceOfUser2AfterTransaction.toNumber());
            assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                        balanceOfUser1AfterTransaction.toNumber());
            assert(balanceOfUser2AfterTransaction.toNumber() <
                balanceOfUser2BeforeTransaction.toNumber());
        });

        it('user2 is the owner of the star after they buy it', async () => { 
            let starPrice = web3.toWei(.05, 'ether');
            await contract.buyStar(1, {from: user2, value: starPrice});
            assert.equal(await contract.ownerOf(1), user2);
        });
    });
});
