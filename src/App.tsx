import './App.css';
import { useEffect } from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loadBalance } from './reducers/balanceReducer';
import { loadPrice } from './reducers/priceReducer';
import { loadHistorial } from './reducers/historialReducer';
import BuyTokens from './components/BuyTokens';
import WithdrawTokens from './components/Withdraw';
import Header from './components/Header';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { useAccount, useConnect } from 'wagmi';
import { getWalletClient } from '@wagmi/core'

import RouletteGame from './components/RouletteGame';
import Wallet from './components/Wallet';
import Games from './components/Games';
import { loadAccounts } from './reducers/accountReducer';
import { toggleConnectModal } from './reducers/connectModalReducer';
import { config } from "./wagmi";

const App = () => {
  const dispatch = useDispatch()
  const { address } = useAccount()

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

  const loadInfo = async () => {
    if (account !== "") {
      await dispatch(loadBalance(account));
      await dispatch(loadPrice(account));
      const walletClient = await getWalletClient(config)
      await dispatch(loadHistorial(account, walletClient))
    }
  }

  useEffect(() => {
    loadInfo()
  }, [account])

  useEffect(() => {
    dispatch(loadAccounts(address))
  }, [address])

  const LoginDialog = () => {
    const open = useSelector((state) => state.connectModal)
    const dispatch = useDispatch()
    const { connectors, connect } = useConnect()

    return (
      <Dialog open={open} onClose={() => dispatch(toggleConnectModal())}>
        <DialogTitle>Choose Wallet</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="contained"
                color="error"
                onClick={() => {
                  connect({ connector });
                  dispatch(toggleConnectModal());
                }}
              >
                {connector.name}
              </Button>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  const backgroundImageUrl = 'url(/images/bg.jpg)';
  return (
    <BrowserRouter>
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
        <Grid item xs={12} mb={10}>
          <Header balance={balance} account={account} />
        </Grid>
        <Routes>
          <Route path="/Wallet" element={<Wallet />}>
            <Route path="buyTokens" element={<BuyTokens account={account} price={price} />} />
            <Route path="withdrawTokens" element={<WithdrawTokens balance={balance} account={account} price={price} />} />
          </Route>
          {/* Set /games as the home page */}
          <Route path="/" element={<Games />} />
          <Route path="/Roulette" element={<RouletteGame balance={balance} account={account} />} />
        </Routes>
        <LoginDialog />
        <Grid item xs={12}>
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
    </BrowserRouter>
  );
};

export default App;
