// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Ballot {
    struct Voter {
        bool voted;
        bool canVote;
    }
    address public manager;
    struct Proposal {
        string name;
        uint256 voteCount;
    }
    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    constructor(string[] memory proposalNames) {
        manager = msg.sender;
        voters[manager].canVote = true;
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getVoter(address voter) public view returns (Voter memory) {
        return voters[voter];
    }

    modifier isManager() {
        require(msg.sender == manager, "Only manager can pass this function");
        _;
    }

    function giveRightToVote(address voter) external isManager {
        require(!voters[voter].voted, "The voter already voted");
        voters[voter].canVote = true;
    }

    function vote(uint256 index) external {
        Voter storage sender = voters[msg.sender];
        require(sender.canVote, "Has no right to vote");
        require(!sender.voted, "Already Voted.");
        sender.voted = true;
        proposals[index].voteCount++;
    }

    function winningProposal() private view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposal_ = i;
            }
        }
    }

    function winnerName()
        external
        view
        isManager
        returns (string memory winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
