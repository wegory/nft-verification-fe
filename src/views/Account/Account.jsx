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
import { useToasts } from "react-toast-notifications";
import "react-dropdown/style.css";

let chatGroups = [
  {
    contractAddress: "0x5c48b2e715ac9bc8d9b1aa633691d71c0748670d",
    discordRoleName: "VoxoDeus",
    minBalance: 1,
    name: "VoxoDeus",
    platform: "rinkeby",
  },
  {
    contractAddress: "0x16baf0de678e52367adc69fd067e5edd1d33e3bf",
    discordRoleName: "CryptoKittiesRinkeby",
    minBalance: 1,
    name: "CryptKittiesRinkeby",
    platform: "rinkeby",
  },
  {
    contractAddress: "0x0ead1160bd2ca5a653e11fae3d2b39e4948bda4d",
    discordRoleName: "SushiMillionaire",
    minBalance: 8.3333e22,
    name: "SUSHI Millionaire Club",
    platform: "rinkeby",
  },
];

const fetchChatGroups = async () => {
  //   const response = await axios.get("https://nansen-on-chain-auth-api-jjr6pd3pjq-uc.a.run.app/v1/get-channels"); // prod
  //   const data = response.data; // prod

  const data = chatGroups; // dev

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

function Account({ account, isLoading, getChainId, getAccount, requestAccount, getBalance }) {
  console.log("account:", account);

  const { addToast } = useToasts();
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
  const [discordUid, setDiscordUid] = useState(null);

  const getChatGroups = async () => {
    let chatGroups = await fetchChatGroups();
    setChatGroups(chatGroups);
  };

  useEffect(() => {
    getChatGroups();
  }, []);

  const connectClick = useCallback(requestAccount, []);

  const sign = async () => {
    if (account && chatGroup && discordUid) {
      const currentTime = new Date().toLocaleString();

      const message = `Alohomora: ${currentTime}`;

      const from = account;
      try {
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
            discordUserId: discordUid,
          };
          console.log("data:", data);
          const response = await axios.post("https://nansen-on-chain-auth-api-jjr6pd3pjq-uc.a.run.app/v2/verify-sig-and-ownership", data);
          console.log("response:", response);
        }
      } catch (e) {
        console.log("error", e);
        addToast("Verification canceled by user", { appearance: "warning" });
      }
    } else if (account === null) {
      addToast("Please connect to metamask first", { appearance: "error" });
    } else if (chatGroup === null) {
      addToast("Please select a chat group", { appearance: "error" });
    } else if (discordUid === null) {
      addToast("Please enter your Discord User ID", { appearance: "error" });
    }
  };
  const classes = useStyles();

  //   const handleSubmit = async (evt) => {
  //     evt.preventDefault();
  //   };

  const copyText = (text) => {
    addToast("Copied to clipboard", { appearance: "info" });
    navigator.clipboard.writeText(text);
  };

  //   const handleDiscordIdInput = (evt) => {
  // 	evt.preventDefault();
  // 	setDiscordUid(evt)
  //   }

  return (
    <div className={classes.account}>
      <AccountListener getAccount={getAccount} />
      <Logo />

      <div className={"card"}>
        <Typography variant="h2"> Nansen NFT Spaces </Typography>
        <Typography variant="subtitle1" style={{ color: "#e3e3e3" }}>
          Private Discord Chat spaces for verified NFT/ERC20 Owners{" "}
        </Typography>
        <Dropdown
          options={chatGroups}
          onChange={(chatGroup) => setChatGroup(chatGroup)}
          value={null}
          placeholder="Select private chat group to join 👇"
          className={"dropdown"}
        />
        <form style={{ marginTop: 20, marginBottom: 10 }}>
          <label>
            {/* <p onClick={useBalanceOf} style={{ cursor: "pointer", marginBottom: 10 }}></p> */}
            <input type="number" value={null} onChange={(e) => setDiscordUid(e.target.value)} placeholder={"Discord User ID"} />
          </label>
          {/* <input style={{ marginLeft: 2, width: 100, height: 50, backgroundColor: "#323f54", cursor: "pointer" }} type="submit" value="Get your Discord UID with our Discord bot" /> */}
        </form>
        <a href={`https://discord.gg/vXbTWnyd?`} target="_blank" rel="noreferrer">
          Have trouble finding your Discord User ID? Join this Discord Server and type
        </a>{" "}
        <span style={{ color: "white", opacity: 0.6 }} onClick={() => copyText()}>
          .whoami
        </span>
        <div style={{ marginTop: 20 }}>
          {account ? (
            <>
              <button onClick={sign}>Verify and Join</button>
            </>
          ) : (
            <button onClick={connectClick}>Verify with Metamask</button>
          )}
        </div>
      </div>
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
