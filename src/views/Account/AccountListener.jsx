import React, { useEffect } from 'react';

function AccountListener({ getAccount }) {
  useEffect(() => {
    window.ethereum.on('connect', handleConnected);
    window.ethereum.on('disconnect', handleDisconnected);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeAllListeners('connect');
      window.ethereum.removeAllListeners('disconnect');
      window.ethereum.removeAllListeners('chainChanged');
      window.ethereum.removeAllListeners('accountsChanged');
    }
  }, [])

  const handleConnected = (connectInfo) => {
    console.log('---Connected', connectInfo);
  }

  const handleDisconnected = (event) => {
    console.warn('Ethereum disconnected!', event);
    window.location.reload();
  }

  const handleChainChanged = (event) => {
    console.warn('Ethereum chain changed!', event);
    window.location.reload();
  }

  const handleAccountsChanged = (account) => {
    getAccount();
  }

  return null;
}

export default AccountListener;
