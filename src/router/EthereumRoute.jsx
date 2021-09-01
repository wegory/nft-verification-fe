import React from 'react';
import { Redirect } from 'react-router-dom';

function EthereumRoute({ children }) {
  if (!window.ethereum) {
    return <Redirect to="/" />;
  }

  return children;
}

export default EthereumRoute
