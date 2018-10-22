const StarNotary = artifacts.require('StarNotary');

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
            await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            const balance = await contract.balanceOf(user1);
            assert.equal(balance.toNumber(), 1);
        });

        it('emits the correct event during creation of a new token', async () => {
            const tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            assert.equal(tx.logs[0].event, 'Transfer');
        });

        it('does not allow duplicated stars', async () => {
            await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            const balance = await contract.balanceOf(user1);
            assert.equal(balance.toNumber(), 1);

            // create a second star
            try {
                await contract.createStar('A', 'B', 'C', 'story', {
                    from: user1
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert Duplicate star');
            }
        });

        it('does not allow duplicated stars - story can be different', async () => {
            await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            const balance = await contract.balanceOf(user1);
            assert.equal(balance.toNumber(), 1);

            // create a second star
            try {
                await contract.createStar('A', 'B', 'C', 'story10', {
                    from: user1
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert Duplicate star');
            }
        });

        it('can create multiple unique stars', async () => {
            await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            let balance = await contract.balanceOf(user1);
            assert.equal(balance.toNumber(), 1);
            await contract.createStar('C', 'B', 'A', 'story10', {
                from: user1
            });
            balance = await contract.balanceOf(user1);
            assert.equal(balance.toNumber(), 2);
        });
    });

    describe('Can put star up for sale', () => {
        let tokenId;
        let tx;
        beforeEach( async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
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
            await contract.putStarUpForSale(tokenId, 12, {
                from: user1
            });
            assert.equal(await contract._starIsForSale(tokenId), true);
        });

        it('Sets price correctly for token for sale', async () => {
            await contract.putStarUpForSale(tokenId, 12, {
                from: user1
            });
            assert.equal(await contract.starsForSale(tokenId), 12);
        });
    });

    describe('Stars for Sale', () => {
        let tokenId;
        let tx;
        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            tokenId2 = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx2 = await contract.createStar('A', 'A', 'A', 'story', {
                from: user1
            });
        });
        it('returns empty list', async () => {
            const stars = await contract._getStarsForSale();
            assert.equal(stars.length, 0);
        });
        it('returns single star', async () => {
            await contract.putStarUpForSale(tokenId, 12, {
                from: user1
            });
            const stars = await contract._getStarsForSale();
            assert.equal(stars.length, 1);
            assert(contract._starIsForSale(stars[0]));
            const starInfoArray = await contract.tokenIdToStarInfo(stars[0]);
            assert(starInfoArray.includes('A') &&
                 starInfoArray.includes('B') &&
                 starInfoArray.includes('C') &&
                 starInfoArray.includes('story')
            );
        });
        it('returns multiple star', async () => {
            await contract.putStarUpForSale(tokenId, 12, {
                from: user1
            });
            await contract.putStarUpForSale(tokenId2, 12, {
                from: user1
            });
            const stars = await contract._getStarsForSale();
            assert.equal(stars.length, 2);
            assert(contract._starIsForSale(stars[0]));
            assert(contract._starIsForSale(stars[1]));
        });
    });

    describe('A user can purchase a star this is for sale', () => {
        let tokenId;
        let tx;

        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            const starPrice = web3.toWei(.05, 'ether');
            await contract.putStarUpForSale(tokenId, starPrice, {
                from: user1
            });
        });
        it('funds move correctly', async () => {
            const starPrice = web3.toWei(.05, 'ether');
            let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1);
            let balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2);
            await contract.buyStar(tokenId, {from: user2, value: starPrice});
            let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1);
            let balanceOfUser2AfterTransaction = web3.eth.getBalance(user2);
            assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                        balanceOfUser1AfterTransaction.toNumber());
            assert(balanceOfUser2AfterTransaction.toNumber() <
                balanceOfUser2BeforeTransaction.toNumber());
        });

        it('user2 is the owner of the star after they buy it', async () => { 
            let starPrice = web3.toWei(.05, 'ether');
            await contract.buyStar(tokenId, {from: user2, value: starPrice});
            assert.equal(await contract.ownerOf(tokenId), user2);
        });
    });

    describe('Check if star exists', async() => {
        let tokenId;
        let tx;

        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
        });

        it('returns True', async() => {
            const starExists = await contract._checkIfStarExists('A', 'B', 'C');
            assert.equal(starExists, true);
        });

        it('returns false', async () => {
            const starExists = await contract._checkIfStarExists('A', 'A', 'A');
            assert.equal(starExists, false);
        });
    });

    describe('Check if token exists', async () => {
        let tokenId;
        let tx;

        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
        });

        it('returns True', async () => {
            const tokenExists = await contract._checkIfTokenExists(tokenId, {from: user1});
            assert.equal(tokenExists, true);
        });

        it('returns false', async () => {
            const tokenExists = await contract._checkIfTokenExists('0x00', {
                from: user1
            });
            assert.equal(tokenExists, false);
        });
    });
    describe('Approve to sell', async () => {
        let tokenId;
        let tx;

        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
        });

        it('works', async () => {
            const approveTx = await contract.approve(user2, tokenId, {
                from: user1
            });
            assert.equal(await contract.getApproved(tokenId), user2);
            assert.equal(approveTx.logs[0].event, 'Approval');
        });

        it('cannot approve yourself', async () => {
            try {
                await contract.approve(user1, tokenId, {
                    from: user1
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert');
            }
        });
    });

    describe('Safe transfer from', async () => {
        let tokenId;
        let tx;

        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
        });

        it('works', async () => {
            await contract.safeTransferFrom(user1, user2, tokenId, {
                from: user1
            });
            assert.equal(await contract.ownerOf(tokenId), user2);
        });

        it('cannot transfer to yourself', async () => {
            try {
                await contract.approve(user1, tokenId, {
                    from: user1
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert');
            }
        });

        it('cannot transfer star you do not own', async () => {
            try {
                await contract.approve(user2, tokenId, {
                    from: user2
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert');
            }
        });
    });

    describe('Approve to sell all', async () => {
        it('can enable approve all', async () => {
            const approveAllTx = await contract.setApprovalForAll(user2, true, {
                from: user1
            });
            assert.equal(await contract.isApprovedForAll(user1, user2), true);
            assert.equal(approveAllTx.logs[0].event, 'ApprovalForAll');
        });

        it('can disable approve all', async () => {
            let approveAllTx;
            approveAllTx = await contract.setApprovalForAll(user2, true, {
                from: user1
            });
            assert.equal(await contract.isApprovedForAll(user1, user2), true);
            assert.equal(approveAllTx.logs[0].event, 'ApprovalForAll');
            approveAllTx = await contract.setApprovalForAll(user2, false, {
                from: user1
            });
            assert.equal(await contract.isApprovedForAll(user1, user2), false);
            assert.equal(approveAllTx.logs[0].event, 'ApprovalForAll');
        });

        it('cannot approval all yourself', async () => {
            try {
                await contract.setApprovalForAll(user1, true, {
                    from: user1
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.message, 'VM Exception while processing transaction: revert');
            }
        });
    });

    describe('Token id to star info', () => {
        let tokenId;
        let tx;
        beforeEach(async () => {
            tokenId = await contract._getTokenIdFromStarDetails('A', 'B', 'C');
        });
        it('throws excpetion if star does not exist', async () => {
           try {
               await contract.tokenIdToStarInfo(tokenId, {
                   from: user1
               });
               assert.fail();
           } catch (e) {
               assert.equal(e.message, 'VM Exception while processing transaction: revert Invalid token');
           }
        });
        it('returns single star info', async () => {
            tx = await contract.createStar('A', 'B', 'C', 'story', {
                from: user1
            });
            const starInfoArray = await contract.tokenIdToStarInfo(tokenId, {
                from: user1
            });
            assert(starInfoArray.includes('A') && 
                starInfoArray.includes('B') &&
                starInfoArray.includes('C') && 
                starInfoArray.includes('story')
            );
        });
    });
});
