const BigNumber = web3.BigNumber;
var ethUtil = require('ethereumjs-util')
var Tx = require('ethereumjs-tx');
const expect = require('chai').expect;
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();
    
import expectThrow from './helpers/expectThrow'; 

var VoteFactory = artifacts.require("./VoteFactory.sol");
var Ownable = artifacts.require("./Ownable.sol");

contract('VoteFactory', function(accounts) {
    var voteFactory;

    const owner = accounts[0];
    const creator = accounts[1];
    const user = accounts[2];

    const question0 = "Question 0";
    const answer0 = "Answer 0";
    const answer1 = "Answer 1";

    beforeEach('setup contract for each test', async function () {
        voteFactory = await VoteFactory.new({from: owner});
    });

    it('vote created', async function () {
        await voteFactory.createVote(question0, creator, {from: owner});
        //await voteFactory.createVote(question0, creator, {from: creator});
        //await voteFactory.createVote(question0, creator, {from: user});
        //var vote = await voteFactory.votes(0);// доделать
        //vote.should.be.equal(question0);
    });

    it('answer added by creator', async function () {
        await voteFactory.createVote(question0, creator, {from: creator});
        await voteFactory.addAnswer(0 , answer0, {from: creator});
    });

    it('answer added by user', async function () {
        await voteFactory.createVote(question0, owner, creator, {from: creator});
        await expectThrow(voteFactory.addAnswer(0, answer0, {from: user}));
    });

    it('start vote', async function () {
        await voteFactory.createVote(question0, owner, creator, {from: creator});
        await voteFactory.startVote(0 , {from: user});
    });

    it('Stopped vote', async function () {
        await voteFactory.createVote(question0, owner, creator, {from: creator});
        await voteFactory.stopVote(0, owner, creator, {from: owner});
        await voteFactory.stopVote(0, owner, creator, {from: creator});
        await voteFactory.stopVote(0, owner, creator, {from: user});
    });

   /* it('answer added by unknown user', async function () {
        await voteFactory.createVote(question0, owner, creator, {from: creator});
        await voteFactory.addAnswer(0, answer0, {from: user});
    });*/
    

    // it('attack', async function () {
    //     var from = 0x01d9D1Ac7ebd965dBf0cbBdc5Ef5093DedA7f602;
    //     var from_bytes = "01d9D1Ac7ebd965dBf0cbBdc5Ef5093DedA7f602";
    //     var to = 0x01d9D1Ac7ebd965dBf0cbBdc5Ef5093DedA7f602;
    //     var to_bytes = "01d9D1Ac7ebd965dBf0cbBdc5Ef5093DedA7f602";
    //     var value = 100;
    //     var value_bytes = "8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    //     var feeSmt = 2;
    //     var feeSmt_bytes = "7000000000000000000000000000000000000000000000000000000000000001";
    //     var nonce = 0;
    //     var nonce_bytes = "0000000000000000000000000000000000000000000000000000000000000000";
    //     var msgBuffer = ethUtil.sha3("0x" + from_bytes + to_bytes + value_bytes + feeSmt_bytes + nonce_bytes)
    //     var messagetoSign = ethUtil.bufferToHex(msgBuffer)
    //     var messagetoSend = ethUtil.bufferToHex(ethUtil.hashPersonalMessage(msgBuffer)) 

    //     const unlockedAccount = accounts[0]
    //     var privkey = new Buffer('28780b50f222df8539903fc88f66cb02a602d9c1b8fc84e0e297cf51f7ca5911', 'hex');

    //     var vrs = ethUtil.ecsign(msgBuffer, privkey);
    //     let v = vrs.v.toString()
    //     let r = ethUtil.bufferToHex(vrs.r)
    //     let s = ethUtil.bufferToHex(vrs.s)

    //     console.log(' msg2sign: ' + messagetoSign)        
    //     console.log(' msg2send: ' + messagetoSend)    
    //     console.log()
    //     console.log(v)
    //     console.log(r)
    //     console.log(s)
    //     // console.log(ethUtil.publicToAddress(ethUtil.ecrecover(msgBuffer, v, r, s)).toString('hex'))    
        
    //     const recoveredAddress = await this.contract.transferProxy(from, to, value, feeSmt, v, r, s)
    //     recoveredAddress.should.be.equal(unlockedAccount,'The recovered address should match the signing address')
    // });
});
