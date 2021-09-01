import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hexStringToNumber } from '../../utils/ethereumConvert'

const namespace = 'ethereum';

/**
 * Actions
 */

export const getChainId = createAsyncThunk(
	`${namespace}/getChainId`,
	async () => {
		const response = await window.ethereum.request({ method: 'eth_chainId' });
		return { chainId: hexStringToNumber(response) };
	}
)

export const getAccount = createAsyncThunk(
	`${namespace}/getAccount`,
	async () => {
		const accounts = await window.ethereum.request({ method: 'eth_accounts' });
		return { accounts };
	}
)

export const requestAccount = createAsyncThunk(
	`${namespace}/requestAccount`,
	async () => {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		return { accounts };
	}
)

export const getBalance = createAsyncThunk(
	`${namespace}/getBalance`,
	async (account) => {
		const params = [account, 'latest'];
		const balance = await window.ethereum.request({ method: 'eth_getBalance', params });
		return { balance };
	}
)

export const sendTransaction = createAsyncThunk(
	`${namespace}/sendTransaction`,
	async (transactionParameters) => {
		const params = [transactionParameters];
		const transaction = await window.ethereum.request({ method: 'eth_sendTransaction', params });
		return { transaction };
	}
)

// export const getSignature = createAsyncThunk(
// 	`${namespace}/getSignature`,

// 	async (transactionParameters) => {
// 		const params = [transactionParameters];
// 		const transaction = await window.ethereum.request({ method: 'eth_sendTransaction', params });
// 		return { transaction };
// 	  }
// )
/**
 * Reducers
 */

const commonPendingReducer = (state, action) => {
	state.isLoading = true;
}

const commonRejectedReducer = (state, action) => {
	state.isLoading = false;
	state.error = action.error;
}

const chainIdFulfilledReducer = (state, action) => {
	state.chainId = action.payload.chainId;
	state.isLoading = false;
}

const accountFulfilledReducer = (state, action) => {
	state.account = action.payload.accounts[0];
	state.isLoading = false;
}

const balanceFulfilledReducer = (state, action) => {
	state.balance = action.payload.balance;
	state.isLoading = false;
}

const transactionFulfilledReducer = (state, action) => {
	state.transactions.push(action.payload.transaction);
	state.isLoading = false;
}

/**
 * Slice
 */

const counterSlice = createSlice({
	name: namespace,
	initialState: {
		isLoading: false,
		chainId: null,
		account: undefined,
		balance: undefined,
		transactions: [],
	},
	reducers: {},
	extraReducers: {
		[getChainId.pending]: commonPendingReducer,
		[getChainId.fulfilled]: chainIdFulfilledReducer,
		[getChainId.rejected]: commonRejectedReducer,
		[getAccount.pending]: commonPendingReducer,
		[getAccount.fulfilled]: accountFulfilledReducer,
		[getAccount.rejected]: commonRejectedReducer,
		[requestAccount.pending]: commonPendingReducer,
		[requestAccount.fulfilled]: accountFulfilledReducer,
		[requestAccount.rejected]: commonRejectedReducer,
		[getBalance.pending]: commonPendingReducer,
		[getBalance.fulfilled]: balanceFulfilledReducer,
		[getBalance.rejected]: commonRejectedReducer,
		[sendTransaction.pending]: commonPendingReducer,
		[sendTransaction.fulfilled]: transactionFulfilledReducer,
		[sendTransaction.rejected]: commonRejectedReducer,
	}
})

export default counterSlice.reducer
