import './App.css';
import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { Grid } from '@mui/material';
import contractsService from './services/contractsService';
import {useDispatch, useSelector } from "react-redux";
import { loadAccounts } from './reducers/accountReducer';
import { loadBalance } from './reducers/balanceReducer';
import { loadPrice } from './reducers/priceReducer';
import { loadHistorial } from './reducers/historialReducer';
import BuyTokens from './components/BuyTokens';
import WithdrawTokens from './components/Withdraw';
import Header from './components/Header';
import {
  Routes,
  Route,
} from "react-router-dom"


import RouletteGame from './components/RouletteGame';
import Wallet from './components/Wallet';
import Games from './components/Games';

const App = () => {
  const dispatch = useDispatch()
  const balance = useSelector(({ balance }) => {
    return balance;
  });
  const account = useSelector(({ account }) => {
    return (
      account
    )
  })

  const price = useSelector(({ price }) => {
    return price;
  });
  
  
const SocialIcons = () => (
  <div style={{ textAlign: 'center' }}>
    {/* Replace the following with your actual social icons */}
	<a href="https://t.me/ramykatour" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/tele.png"  // Replace with the actual path to your Facebook icon image
      alt="telegram"
      style={{ width: '30px', height: '30px', margin: '0 10px' }}
    />
	 </a>
	 <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer">
	 <img
      src="/images/dis.png"  // Replace with the actual path to your LinkedIn icon image
      alt="discord"
      style={{ width: '30px', height: '30px', margin: '0 10px' }}
    />
	</a>
	<a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/twitter.png"   // Replace with the actual path to your Twitter icon image
      alt="Twitter"
      style={{ width: '30px', height: '30px', margin: '0 10px' }}
    />
	</a>
  </div>
);

// CopyrightFooter component
const CopyrightFooter = () => (
  <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
    {/* Replace the following with your actual copyright text */}
      &copy; 2023 Your Roulette. All rights reserved.
  </div>
);



const web3Handler = async () => {
    try {
      if (!window.ethereum) {
        // If the Ethereum object is not found, redirect the user to a specific URL
        window.location.href = "https://metamask.app.link/dapp/fuse-roulette.vercel.app";
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      dispatch(loadAccounts(accounts[0]));

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId === '0x89') {
          window.location.reload();
        } else {
          // Handle other network changes if needed
        }
      });

      window.ethereum.on('accountsChanged', async function (accounts) {
        dispatch(loadAccounts(accounts[0]));
        await web3Handler();
      });

      await contractsService.loadContracts(signer);

      const currentChainId = await provider.getNetwork().then((network) => network.chainId);

      if (currentChainId !== '0x4b5e078d') {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
                chainId: '0x4b5e078d',
				chainName: 'Polygon Mainnet',
				nativeCurrency: {
				name: 'FUSE',
				symbol: 'FUSE',
				decimals: 18,
              },
              rpcUrls: ['https://rpc.flash.fuse.io'],
              blockExplorerUrls: ['https://explorer.flash.fuse.io'],
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const loadInfo = async () => {
    if (account !==""){
      await dispatch(loadBalance(account));
      await dispatch(loadPrice(account));
      await dispatch(loadHistorial(account))
    }
  }

  useEffect(() => {
    loadInfo()
}, [account])

const backgroundImageUrl = 'url(/images/bg.jpg)'; 
  return (
  <Grid
      container
      rowSpacing={{ xs: 8, sm: 9 }}
      sx={{
        width: 1,
        backgroundColor: '#000000',
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover', // Adjust as needed
        backgroundPosition: 'center', // Adjust as needed
      }}
    >
      <Grid item xs={12}>
        <Header login={web3Handler} balance={balance} account={account}/>
      </Grid>
    <Grid item xs={12}>
      <Routes>
        <Route path="/Wallet" element={<Wallet/>}>
          <Route path="buyTokens" element={<BuyTokens account={account} price={price} />} />
          <Route path="withdrawTokens" element={<WithdrawTokens balance={balance} account={account} price={price}/>} />
        </Route>
        {/* Set /games as the home page */}
        <Route path="/" element={<Games/>} />
        <Route path="/Roulette" element={<RouletteGame balance={balance} account={account} />} />
      </Routes>
      </Grid>
      {/* Social Icons */}
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <SocialIcons />
      </Grid>
	
      {/* Copyright Footer */}
      <Grid item xs={12}>
        <CopyrightFooter />
      </Grid>
    </Grid>
  );
};

export default App;
