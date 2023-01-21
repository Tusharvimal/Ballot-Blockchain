const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Checking Operations', () => {
    let ballot;
    let params = ['BJP', 'AAP'];
    let manager, voter1, voter2;
    beforeEach(async () => {
        const Ballot = await ethers.getContractFactory('Ballot');
        ballot = await Ballot.deploy(params);

        [manager, voter1, voter2] = await ethers.getSigners();
        // console.log(manager);
        await ballot.connect(manager).giveRightToVote(voter1.address)
        await ballot.connect(manager).giveRightToVote(voter2.address)
        await ballot.connect(voter1).vote(0)
    })
    describe('Contract Deployment', () => {
        it('should assign manager name', async () => {
            // console.log(manager);
            expect(await ballot.manager()).to.equal(manager.address);
        })
        it('proposalsName', async () => {
            // console.log(await ballot.getProposals())
            const info = await ballot.getProposals();
            // console.log(info)
            let value = info.map((i) => {
                return i.name;
            })
            expect(value).to.eql(params);
        })
    })
    describe('Vote Operations', () => {
        it('giving right to vote', async () => {
            // await ballot.connect(manager).giveRightToVote(voter2.address)
            let voter = await ballot.getVoter(voter1.address)
            expect(voter.canVote).to.equal(true)
        })
        it('vote candidate', async () => {
            // await ballot.connect(voter1).vote(0)
            // const info = await ballot.getProposals();
            // let value = info[0].voteCount;
            // expect(value).to.equal(1);
        })
    })
    describe('Winner Name', () => {
        it('winner', async () => {
            const winner = await ballot.connect(manager).winnerName();
            expect(winner).to.equal('BJP')
        })
    })
})