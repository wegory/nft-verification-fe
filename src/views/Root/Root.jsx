import React from 'react'
import { Redirect } from "react-router-dom";

function Root() {
  if (window.ethereum) {
    return <Redirect to="/account" />
  }

  return (
    <div className="root">
      <p>No ethereum provider detected.</p>
      <p>Install <a href="https://metamask.io/download.html" target="_blank">MetaMask</a> to continue</p>
    </div>
  )
}

export default Root
