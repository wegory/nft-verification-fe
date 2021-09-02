import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getChainId, getAccount, requestAccount, getBalance, sendTransaction } from "../../store/ethereum/ethereumSlice";
import AccountListener from "./AccountListener";
import Logo from "../../components/Logo";
import useStyles from "./Account.style";
import axios from "axios";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

let chatGroups = [
  { name: "VoxoDeus", minBalance: 1, contractAddress: "0x5c48b2e715ac9bc8d9b1aa633691d71c0748670d" },
  {
    name: "CryptKittiesRinkeby",
    minBalance: 1,
    contractAddress: "0x16baf0de678e52367adc69fd067e5edd1d33e3bf",
  },
  {
    name: "SUSHI Millionaire Club",
    minBalance: 83333000000000000000000,
    contractAddress: "0x0ead1160bd2ca5a653e11fae3d2b39e4948bda4d",
  },
];

const fetchChatGroups = async () => {
  const response = await axios.get("https://nansen-on-chain-auth-api-jjr6pd3pjq-uc.a.run.app/v1/get-channels");
  const data = response.data;

  //   const data = chatGroups;

  let options = [];

  data.map((chatGroup) => {
    options.push({
      value: chatGroup,
      label:
        chatGroup["name"] + ` (you need to have at least ${chatGroup["minBalance"]} ${chatGroup["minBalance"] != 1 ? "tokens" : "token"} to join)`,
    });
  });

  return data, options;
};

function Account({ account, isLoading, getChainId, getAccount, requestAccount, getBalance, sendTransaction }) {
  useEffect(() => {
    getChainId();
    getAccount();
  }, []);

  useEffect(() => {
    if (account) {
      getBalance(account);
    }
  }, [account]);

  const [chatGroups, setChatGroups] = useState([]);
  const [chatGroup, setChatGroup] = useState(null);

  const getChatGroups = async () => {
    let chatGroups = await fetchChatGroups();
    setChatGroups(chatGroups);
  };

  useEffect(() => {
    getChatGroups();
  }, []);

  const connectClick = useCallback(requestAccount, []);

  const sign = async () => {
    if (chatGroup) {
      const currentTime = new Date().toLocaleString();

      const message = `Alohomora: ${currentTime}`;

      const from = account;

      const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, from],
      });

      if (signature) {
        const data = {
          account,
          sig: signature,
          token: chatGroup["value"]["contractAddress"],
          msg: message,
          "req-bal": 1,
          chain: "ethereum",
        };
        console.log("data:", data);
        const response = await axios.post("https://nansen-on-chain-auth-api-jjr6pd3pjq-uc.a.run.app/v1/verify-sig-and-ownership", data);
        console.log("response:", response);
      }
    }
  };
  const classes = useStyles();

  return (
    <div className={classes.account}>
      <AccountListener getAccount={getAccount} />
      <Logo />
      <Typography variant="h2"> Nansen NFT Spaces </Typography>
      <Typography variant="subtitle1" style={{ color: "#e3e3e3" }}>
        Private Discord Chat spaces for verified NFT/ERC20 Owners{" "}
      </Typography>
      <Dropdown
        options={chatGroups}
        onChange={(chatGroup) => setChatGroup(chatGroup)}
        value={null}
        placeholder="Select private chat group to join 👇"
      />
      ;
      {account ? (
        <>
          <button onClick={sign}>Verify and Join</button>
        </>
      ) : (
        <button onClick={connectClick}>Connect</button>
      )}
    </div>
  );
}

export default connect(
  (state) => ({
    chainId: state.ethereum.chainId,
    account: state.ethereum.account,
    balance: state.ethereum.balance,
    transactions: state.ethereum.transactions,
    isLoading: state.ethereum.isLoading,
  }),
  {
    getChainId,
    getAccount,
    requestAccount,
    getBalance,
    sendTransaction,
  }
)(Account);
