pragma solidity ^0.4.17; 

import "./Ownable.sol";

contract VoteFactory is Ownable {

    event NewVote(
        uint _voteId,
        string question
    );

    event settedAnswer(
        uint voteId,
        uint answerId,
        string answer
    );

    enum State {
        Initial,
        Started,
        Stopped
    }

    struct Vote {
        string question;
        string[] answers;
        State state;
    }

    struct AnswerToVote { // Структура хранения голосов;
        uint voteId;
        uint answerId;
        string answer;
    }
    
    Vote[] public votes; 
    AnswerToVote[] public answersToVote; // Массив структур голосов;
    mapping(uint => address) voteToOwner;   
    
    modifier voteIsInitial(uint voteId) {
        require(votes[voteId].state == State.Initial);
        _;
    }
    
    modifier voteIsStarted(uint voteId) {
        require(votes[voteId].state == State.Started);
        _;
    }
    
    modifier voteIsStopped(uint voteId) {
        require(votes[voteId].state == State.Stopped);
        _;
    }
    
    function createVote(string _question, address _newOwner) public {
        _transferOwnership(_newOwner);
        require(msg.sender == _newOwner);
        uint voteId = votes.push(Vote(_question, new string[](0), State.Initial)) - 1;
        voteToOwner[voteId] = msg.sender;
        emit NewVote(voteId, _question);
    }
    
    function addAnswer(uint _voteId, string _answer) public voteIsInitial(_voteId) {
        require(voteToOwner[_voteId] == msg.sender);
        votes[_voteId].answers.push(_answer);
        voteToOwner[_voteId] = msg.sender;
    }

    function setAnswer(uint _voteId, uint _answerId, string _answer) public voteIsInitial(_voteId) returns(uint, uint, string) {
        require(voteToOwner[_voteId] == msg.sender);
        for(uint i = 0; i <= votes[_voteId].answers.length; i++) {
            if (keccak256(votes[_voteId].answers[i]) == keccak256(_answer)) {
                emit settedAnswer(_voteId, _answerId, _answer);
                return (_voteId, _answerId, _answer);
            }
        }
    }

    function startVote(uint _voteId) public voteIsInitial(_voteId) {
        votes[_voteId].state = State.Started;
    }

    function cast(uint256 _voteId, uint256 _answerId, string _answer) public voteIsStarted(_voteId) {
        require(voteToOwner[_voteId] == msg.sender);
        uint id = answersToVote.push(AnswerToVote(_voteId, _answerId, _answer)) - 1;
        voteToOwner[id] = msg.sender;
    }

    function results(uint256 _voteId) public view returns(uint, uint, string) {
        for(uint id = 0; id <= answersToVote.length; id++) {
            if (answersToVote[id].voteId == _voteId) {
                return ((answersToVote[id].voteId), (answersToVote[id].answerId), (answersToVote[id].answer));
            }
        }
    }

    function stopVote(uint _voteId, address _newOwner) public voteIsStopped(_voteId) onlyOwner() {
        _transferOwnership(_newOwner);
        require(_newOwner == msg.sender);
    }
}