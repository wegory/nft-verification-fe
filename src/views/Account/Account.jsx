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
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const override = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  border-color: red;
  margin-top: 250px;
`;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let chatGroups = [
  {
    contractAddress: "0x5c48b2e715ac9bc8d9b1aa633691d71c0748670d",
    discordRoleName: "VoxoDeus",
    minBalance: 1,
    name: "VoxoDeus",
    platform: "rinkeby",
    decimal: 0,
    symbol: "VOX",
  },
  {
    contractAddress: "0x16baf0de678e52367adc69fd067e5edd1d33e3bf",
    discordRoleName: "CryptoKittiesRinkeby",
    minBalance: 1,
    name: "CryptKittiesRinkeby",
    platform: "rinkeby",
    decimal: 0,
    symbol: "KITTY",
  },
  {
    contractAddress: "0x0ead1160bd2ca5a653e11fae3d2b39e4948bda4d",
    discordRoleName: "SushiMillionaire",
    minBalance: 8.3333e22,
    name: "SUSHI Millionaire Club",
    platform: "rinkeby",
    decimal: 18,
    symbol: "SUSHI",
  },
];

const fetchChatGroups = async () => {
  const response = await axios.get("https://nansen-on-chain-auth-api-jjr6pd3pjq-uc.a.run.app/v1/get-channels"); // prod
  const data = response.data; // prod

  // const data = chatGroups; // dev

  let options = [];

  data.map((chatGroup) => {
    options.push({
      value: chatGroup,
      label:
        chatGroup["name"] +
        ` | ${capitalizeFirstLetter(chatGroup["platform"])}` +
        ` (min. ${chatGroup["minBalance"] / Math.pow(10, chatGroup["decimals"])} ${chatGroup["symbol"]} to join)`,
    });
  });

  return data, options;
};

function Account({ account, getChainId, getAccount, requestAccount, getBalance }) {
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
  const [isLoading, setIsLoading] = useState(false);

  const getChatGroups = async () => {
    let chatGroups = await fetchChatGroups();
    setChatGroups(chatGroups);
  };

  useEffect(() => {
    getChatGroups();
  }, []);

  const connectClick = useCallback(requestAccount, []);

  const sign = async () => {
    if (!isLoading && account && chatGroup && discordUid) {
      setIsLoading(true);
      const currentTime = new Date().toLocaleString();

      const message = `Join ${chatGroup["value"]["name"]} Private Channel - ${currentTime}`;

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
          if (response && response.data) {
            if (response.data["error"]) {
              addToast(`Verification failed. Are you trying to trick us? 🤨`, { appearance: "error" });
            } else {
              addToast("Awesome! You have been added to a private channel in Nansen Diamond Hands Club's server  😎", { appearance: "success" });
            }
          }
        }
      } catch (e) {
        console.log("error", e);
        addToast("Verification canceled by user", { appearance: "warning" });
      }
      setIsLoading(false);
    } else if (account === null) {
      addToast("Please connect to metamask first", { appearance: "error" });
    } else if (chatGroup === null) {
      addToast("Please select a chat group", { appearance: "error" });
    } else if (discordUid === null) {
      addToast("Please enter your Discord User ID", { appearance: "error" });
    }
  };
  const classes = useStyles();

  const copyText = (text) => {
    addToast("Copied to clipboard", { appearance: "info" });
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <HashLoader color={"#32c8a0"} style={{ opacity: 1 }} loading={isLoading} css={override} size={80} />
      <div className={classes.account} style={{ opacity: isLoading ? 0.2 : 1 }}>
        <AccountListener getAccount={getAccount} />
        <a href={`https://nansen.ai/`} target="_blank" rel="noreferrer">
          <Logo />
        </a>

        <div className={"card"}>
          <Typography variant="h3">Nansen Diamond Hands Club</Typography>
          <Typography variant="subtitle1" style={{ color: "#e3e3e3" }}>
            Private Discord Channel for club NFT/ERC20 Owners{" "}
          </Typography>
          <a href={`https://discord.gg/vXbTWnyd`} target="_blank" rel="noreferrer">
            <div className={"joinButton"}>
              Join Nansen Diamond Hands Club On Discord
              <br />
              <span onClick={() => copyText("https://discord.gg/vXbTWnyd")}>Invite: https://discord.gg/vXbTWnyd</span>
            </div>
          </a>
          <Dropdown
            options={chatGroups}
            onChange={(chatGroup) => setChatGroup(chatGroup)}
            value={null}
            placeholder="Then select private channel to join 👇"
            className={"dropdown"}
          />
          <form style={{ marginTop: 20, marginBottom: 10 }}>
            <label>
              {/* <p onClick={useBalanceOf} style={{ cursor: "pointer", marginBottom: 10 }}></p> */}
              <input type="number" value={null} onChange={(e) => setDiscordUid(e.target.value)} placeholder={"Discord User ID"} />
            </label>
            {/* <input style={{ marginLeft: 2, width: 100, height: 50, backgroundColor: "#323f54", cursor: "pointer" }} type="submit" value="Get your Discord UID with our Discord bot" /> */}
          </form>
          <span style={{ cursor: null }}>
            Have trouble finding your Discord User ID? Type{" "}
            <span style={{ color: "#b9b9b9", cursor: "pointer" }} onClick={() => copyText(".whoami")}>
              .whoami
            </span>{" "}
            in our{" "}
            <a href={`https://discord.gg/vXbTWnyd?`} target="_blank" rel="noreferrer">
              Nansen Diamond Hands Club Discord
            </a>
          </span>

          <div style={{ marginTop: 20, opacity: isLoading ? 0.3 : 1 }}>
            {account ? (
              <>
                <button onClick={sign}>Verify and Join</button>
              </>
            ) : (
              <button onClick={connectClick}>Connect to Metamask</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default connect(
  (state) => ({
    chainId: state.ethereum.chainId,
    account: state.ethereum.account,
    balance: state.ethereum.balance,
    transactions: state.ethereum.transactions,
  }),
  {
    getChainId,
    getAccount,
    requestAccount,
    getBalance,
    sendTransaction,
  }
)(Account);
