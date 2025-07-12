import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addTransaction,
    deleteTransaction,
    editTransaction,
    getTransactions,
} from "./transactionAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initialState = {
    transactions: [],
    isLoading: false,
    isError: false,
    error: "",
    editing: {},
};

// async thunks
export const fetchTransactions = createAsyncThunk(
    "dtransaction/fetchTransactions",
    async (serverDate) => {
        // console.log(serverDate);
        const transactions = await getTransactions(serverDate);
        return transactions;
    }
);

export const createTransaction = createAsyncThunk(
    "dtransaction/createTransaction",
    async ({ data, serverDate }, thunkAPI) => {
   
        const transaction = await addTransaction(data);
      
        // thunkAPI.dispatch(fetchTransactions(serverDate));
        return transaction;
    }
);

export const changeTransaction = createAsyncThunk(
    "dtransaction/changeTransaction",
    async ({ id,p_id,r_id, data,serverDate },thunkAPI) => {
        const transaction = await editTransaction(id, data,p_id,r_id);
       
        // thunkAPI.dispatch(fetchTransactions(serverDate));
        return transaction;
    }
);

export const removeTransaction = createAsyncThunk(
    "transaction/removeTransaction",
    async ({id,serverDate},thunkAPI) => {
        const transaction = await deleteTransaction(id);
        // thunkAPI.dispatch(fetchTransactions(serverDate));
        return transaction;
    }
);

// create slice
const dualtransactionSlice = createSlice({
    name: "dualtransaction",
    initialState,
    reducers: {
        editActive: (state, action) => {
            // console.log(action.payload);
            state.editing = action.payload;
        },
        editInActive: (state) => {
            state.editing = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
                state.transactions = [];
            })
            .addCase(createTransaction.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
     
                state.isError = false;
                state.isLoading = false;
                state.transactions.push(action.payload);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })
            .addCase(changeTransaction.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(changeTransaction.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;

                const indexToUpdate = state.transactions.findIndex(
                    (t) => t.id === action.payload.id
                );

                state.transactions[indexToUpdate] = action.payload;
                state.editing = {};
            })
            .addCase(changeTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })
            .addCase(removeTransaction.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(removeTransaction.fulfilled, (state, action) => {
               
                state.isError = false;
                state.isLoading = false;

                state.transactions = state.transactions.filter(
                    (t) => t.id !== action.meta.arg
                );
            })
            .addCase(removeTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            });
    },
});

export default dualtransactionSlice.reducer;
export const { editActive, editInActive } = dualtransactionSlice.actions;
