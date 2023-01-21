import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import BallotAbi from '../contractsData/Ballot.json';
import BallotAddress from '../contractsData/ballot-address.json'
import './App.css';
import CustomNavbar from './CustomNavbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FirstPage from './FirstPage';
import ManagerAccess from './ManagerAccess';

function App() {

  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState()
  const [ballot, setBallot] = useState()
  const [manager, setManager] = useState()
  const [candidates, setCandidates] = useState()
  const [isManager, setIsManager] = useState(false)

  let data = {
    loading: loading,
    account: account,
    ballot: ballot,
    manager: manager,
    candidates: candidates,
    isManager: isManager
  }

  // web3Handler
  const loadContracts = async (signer, account) => {
    const ballots = new ethers.Contract(BallotAddress.address, BallotAbi.abi, signer);
    // console.log(ballots);
    let copyManager;
    try {
      copyManager = await ballots.manager()
    } catch (e) {
      console.log(e.message)
    }
    // console.log('This is the copyManager', copyManager)
    if (parseInt(copyManager) === parseInt(account)) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }
    setManager(copyManager)
    setBallot(ballots);
    setLoading(false);
    getCandidates(ballots)
  }
  // console.log(loading);

  const getCandidates = async (ballot) => {
    // console.log(ballot)
    let cand;
    try {
      cand = await ballot.getProposals();
    } catch (e) {
      console.log(e.message);
    }
    setCandidates(cand.map((i) => {
      // console.log(parseInt(i.voteCount))
      return i.name;
    }))
  }

  useEffect(() => {
    let isCancelled = false;
    const web3Handler = async () => {
      if (!isCancelled) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        // console.log('getting here')
        const accountBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [accounts[0], 'latest'] })
        let wei = parseInt(accountBalance)
        let balance = wei / (10 ** 18)
        // console.log(balance + 'ETH')
        // console.log(accounts);
        // Getting provider from metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // console.log(provider)
        // Setting Signer
        // A Signer in Ethers. js is an object that represents an Ethereum account
        const signer = provider.getSigner()
        // console.log(signer);
        loadContracts(signer, accounts[0])
      }
    }
    window.ethereum.on('accountsChanged', function () {
      // console.log('is this getting called')
      web3Handler();
    })
    web3Handler()
    return () => {
      isCancelled = true
    }
  }, [])

  // const submit = () => {
  // console.log("button is pressed")
  // }

  return (
    <BrowserRouter>
      <CustomNavbar isManager={isManager} account={account} />
      <Routes>
        <Route exact path='/' element={
          <FirstPage data={data} />
        } />
        <Route exact path='/managerAccess' element={
          <ManagerAccess data={data} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
