import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
	getChainId, getAccount, requestAccount, getBalance, sendTransaction,
} from '../../store/ethereum/ethereumSlice';
import AccountListener from './AccountListener';
import Logo from '../../components/Logo';
import EthNumber from '../../components/EthNumber';
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import { numberToHexString, WEI, GWEI } from '../../utils/ethereumConvert';
import useStyles from './Account.style';
import axios from 'axios';

let formElements = [{
	label: "NFT Address",
	key: "nftAddress"
}, {
	label: "Token ID",
	key: "tokenID"
},
{
	label: "Telegram Handle",
	key: "tgHandle"
}
]


function Account({
	// states
	chainId,
	account,
	balance,
	transactions,
	isLoading,
	// actions
	getChainId,
	getAccount,
	requestAccount,
	getBalance,
	sendTransaction,
}) {
	useEffect(() => {
		getChainId();
		getAccount();
	}, []);

	useEffect(() => {
		if (account) {
			getBalance(account);
		}
	}, [account]);

	const [formData, setFormData] = useState({});

	const [isFormOpen, setFormOpen, contractAddress, setContractAddress] = useState(false);

	const connectClick = useCallback(requestAccount, []);

	const toggleFormClick = useCallback(() => { setFormOpen(!isFormOpen) }, [isFormOpen]);

	const copyClick = useCallback(() => { navigator.clipboard.writeText(account) }, [account]);

	const numberClick = useCallback(() => { getBalance(account) }, [account]);

	const getTransactionDataModel = ({
		address,
		value,
		gasPrice,
		gasLimit,
	}) => ({
		from: account,
		to: address,
		value: numberToHexString(value * WEI),
		gasPrice: numberToHexString(gasPrice * GWEI),
		gas: numberToHexString(gasLimit),
	})

	const handleSendTransaction = async (data) => {
		const transactionData = getTransactionDataModel(data);
		await sendTransaction(transactionData);
	}

	const handleChange = (value, key) => {
		console.log(value, key)

		var current = formData
		current[key] = value
		setFormData(current)

		// setFormData({ ...formData }, ...{ [key]: value });
	}

	const sign = async () => {

		var current = formData
		current["address"] = account
		// console.log(ethereum)

		const currentTime = new Date().toLocaleString()


		const message = `Alohomora: ${currentTime}`

		const from = account

		const signature = await ethereum.request({
			method: 'personal_sign',
			params: [
				message,
				from
			],
		});
		


		
		const data = {
			"account": account,
			"sig": signature,
			"token": current["nftAddress"],
			"msg": message,
			"is-erc721": 1, 
			"req-bal": 1, 
			"token-id": current["tokenID"],
			"chain": "ethereum",
			"eq-bal": 1
		}

		console.log(data)

		const response = await axios.post(
			"https://nansen-on-chain-auth-api-jjr6pd3pjq-uc.a.run.app/v1/verify-sig-and-ownership",
			data
		  );
		
		  console.log(response);



		// const web3 = new Web3(web3.currentProvider);
		// console.log(ethereum.isConnected())
		// const signature = await web3.eth.personal.sign(
		// 	web3.utils.toHex(message),
		// 	account
		// );
		// console.log(signature)
		alert(JSON.stringify(formData));



	}
	const classes = useStyles();

	return (
		<div className={classes.account}>
			<AccountListener getAccount={getAccount} />
			<Logo />
			<Typography variant="h2"> Nansen NFT Spaces </Typography>
			<Typography variant="subtitle1"> Private Telegram Chat spaces for verified NFT/ERC20 Owners </Typography>

			{/* <Typography variant="subtitle2">Chain ID: {chainId}</Typography>
			<Typography variant="h5">Account</Typography> */}
			{account ? (
				<>
					{/* <Tooltip title="Copy to clipboard" placement="top">
						<Button onClick={copyClick}>
							<Typography variant="caption">{account}</Typography>
						</Button>
					</Tooltip> */}
					<EthNumber balance={balance} onClick={numberClick} />

					<form>

						{formElements.map(formElement => {
							return <div className="m3">
								{formElement.label}
								<input value={formData[formElement.key]}
									onChange={(e) => { e.preventDefault(); handleChange(e.target.value, formElement.key) }} />

							</div>
						})}


					</form>

					<button onClick={sign}>sign</button>


					{/* <IconButton className={classes.toggleForm} onClick={toggleFormClick}>
            <ExpandMoreIcon className={isFormOpen ? classes.hideForm : ''} fontSize="large" />
          </IconButton>
          {isFormOpen && <TransactionForm onSubmit={handleSendTransaction} disabled={isLoading} />}
          <TransactionList transactions={transactions} /> */}
				</>
			) : (
				<Button
					className={classes.connectButton}
					variant="contained"
					color="primary"
					onClick={connectClick}
					disabled={isLoading}
				>
					Connect
				</Button>
			)}
		</div>
	)
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
	},
)(Account);
