const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {
    let starName = "Sirius";
    let starStory = "Sirius is the brightest naked eye star in the constellation Canis Major.";
    let ra = "106° 45' 08.10";
    let dec = "-16h 42m 58s";
    let mag = "1.45";
    let starId = 1;
    let contract;

    beforeEach(async function () {
        contract = await StarNotary.new({ from: accounts[0] });
    })

    describe('can create a new star', () => { 
        it('can create a new star and get its name', async function () { 
            await contract.createStar(starName, starStory, ra, dec, mag, starId, {from: accounts[0]});
            let starInfo = await contract.tokenIdToStarInfo(starId);
            assert.equal(starInfo[0].toString(), starName);
            assert.equal(starInfo[1].toString(), starStory);
            assert.equal(starInfo[2].toString(), ra);
            assert.equal(starInfo[3].toString(), dec);
            assert.equal(starInfo[4].toString(), mag);
        })
    })

    describe('can check existance of star', () => {
        beforeEach(async function() {
            await contract.createStar(starName, starStory, ra, dec, mag, starId, {from: accounts[0]});
        })

        it('confirm a star exists', async function () {
            let exists = await contract.checkIfStarExist(ra, dec, mag);
            assert.isTrue(exists)
        })

        it('confirm star does not exist', async function () {
            let ra2 = "1° 1' 1";
            let dec2 = "1h 1m 1s";
            let mag2 = "1";
            let exists = await contract.checkIfStarExist(ra2, dec2, mag2);
            assert.isFalse(exists);
        })
    })

    describe('check star uniqueness', () => {
        it('confirm duplicate star cannot be created', async function () {
            await contract.createStar(starName, starStory, ra, dec, mag, starId, {from: accounts[0]});

            //
            // We are going to try to create the same star with different user accounts and make sure
            // that is prevented.
            // We are also going to test that just tweaking token id while creating the star is also
            // prevented.
            //
            await expectThrow(contract.createStar(starName, starStory, ra, dec, mag, starId, {from: accounts[0]}));
            await expectThrow(contract.createStar(starName, starStory, ra, dec, mag, starId+1, {from: accounts[0]}));
            await expectThrow(contract.createStar(starName, starStory, ra, dec, mag, starId, {from: accounts[1]}));
            await expectThrow(contract.createStar(starName, starStory, ra, dec, mag, starId+1, {from: accounts[1]}));
        })

        it('confirm different stars can be created', async function () {
            for (counter = 1; counter <= 10; counter++) {
                //
                // Create 10 different stars. Note that though the star name and story are same for all the
                // cases, 'ra', 'dec' and 'mag' are different for each of them, which makes each star unique.
                //
                let starName2 = "Test Star";
                let starStory = "Story of test star";
                let ra2 = counter.toString();
                let dec2 = counter.toString();
                let mag2 = counter.toString();
                let tId = counter;
                //
                // For completeness, let us try to create a star with alternate user accounts
                //
                let account = counter%2 == 0? accounts[0] : accounts[1];

                await contract.createStar(starName, starStory, ra2, dec2, mag2, tId, {from: account});

                let starInfo = await contract.tokenIdToStarInfo(tId);
                assert.equal(starInfo[0].toString(), starName);
                assert.equal(starInfo[1].toString(), starStory);
                assert.equal(starInfo[2].toString(), ra2);
                assert.equal(starInfo[3].toString(), dec2);
                assert.equal(starInfo[4].toString(), mag2);
                assert.equal(await contract.ownerOf(tId), account);
            }
        })
    })

    describe('check buying and selling of stars', async function() {
        let starPrice = web3.utils.toWei(".01", "ether");
        beforeEach(async function() {
            await contract.createStar(starName, starStory, ra, dec, mag, starId, {from: accounts[0]});
        })

        it('check owner can put his/her star for sale', async function () { 
            assert.equal(await contract.ownerOf(starId), accounts[0]);
            await contract.putStarUpForSale(starId, starPrice, {from: accounts[0]});
            assert.equal(await contract.starsForSale(starId), starPrice);
        })

        describe('check another account can buy a star up for sale', async function() {
            beforeEach(async function() {
                await contract.putStarUpForSale(starId, starPrice, {from: accounts[0]});
            })

            it('another account is the owner of the star after it is bought', async function () {
                assert.equal(await contract.ownerOf(starId), accounts[0]);
                await contract.buyStar(starId, { from: accounts[1], value: starPrice, gasPrice: 0 });
                assert.equal(await contract.ownerOf(starId), accounts[1]);
            })

            it('another account cannot buy a star because of insufficient balance', async function() {
                assert.equal(await contract.ownerOf(starId), accounts[0]);
                await expectThrow(contract.buyStar(starId, {from: accounts[1], value: starPrice / 2}));
            })

            it('balance of another account is correctly debited after a star is bought', async function() {
                let overpaidAmount = web3.utils.toWei(".05", 'ether');
                let balanceOfAccount1BeforeTransaction = await web3.eth.getBalance(accounts[1]);
                await contract.buyStar(starId, {
                                            from: accounts[1],
                                            value: overpaidAmount,
                                            gasPrice: 0
                                        });
                let balanceOfAccount1AfterTransaction = (await web3.eth.getBalance(accounts[1]));
                //
                // Make sure that the difference in the account balance is same as the star price that is
                // paid to buy it
                //
                assert.equal(balanceOfAccount1BeforeTransaction - balanceOfAccount1AfterTransaction, starPrice);
                assert.equal(await contract.ownerOf(starId), accounts[1]);
            })
        })
    })

    describe('Test ERC721 functions', () => {
        let transaction;
        let tokenId = 1;

        beforeEach(async function () { 
            transaction = await contract.mint(tokenId, {from: accounts[1]});
        })

        it('test owner of, balance credit and transfer event', async function () { 
            const currentOwner = await contract.ownerOf(tokenId);
            assert.equal(accounts[1], currentOwner);

            const balanceBefore = await contract.balanceOf(accounts[1]);
            await contract.mint(tokenId+1, {from: accounts[1]});
            const balanceAfter = await contract.balanceOf(accounts[1]);
            const balance = balanceAfter - balanceBefore;

            assert.equal(balance, 1);
            assert.equal(transaction.logs[0].event, 'Transfer');
        })

        it('token has new owner', async function () {
            transaction = await contract.transferFrom(accounts[1], accounts[2], tokenId, {from: accounts[1]});
            const currentOwner = await contract.ownerOf(tokenId);
            assert.equal(accounts[2], currentOwner);
            assert.equal(transaction.logs[0].event, 'Transfer');
        })
    
    
        it('set account[2] as an approved address', async function () {
            transaction = await contract.approve(accounts[2], tokenId, {from: accounts[1]});
            const approvedUser = await contract.getApproved(tokenId);
            assert.equal(accounts[2], approvedUser);

            await contract.transferFrom(accounts[1], accounts[3], tokenId, {from: accounts[2]});
            const currentOwner = await contract.ownerOf(tokenId);

            assert.equal(accounts[3], currentOwner);
            assert.equal(transaction.logs[0].event, 'Approval');
        })

        it('can set approval for all', async function () {
            transaction = await contract.setApprovalForAll(accounts[2], true, {from: accounts[1]});
            const approval = await contract.isApprovedForAll(accounts[1], accounts[2]);
            assert.equal(true, approval);
        })
    })
})

var expectThrow = async function(promise) {
    try {
        await promise;
    }
    catch (error) {
        assert.exists(error);
        return;
    }
    assert.fail('Expected an error, but none was found');
}