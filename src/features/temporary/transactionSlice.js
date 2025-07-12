import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addTransaction,
    deleteTransaction,
    editTransaction,
    getTransactions,
} from "./transactionAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
const initialState = {
    transactions: [],
    isLoading: false,
    isError: false,
    error: "",
    editing: {},
};

// async thunks
export const fetchTransactions = createAsyncThunk(
    "temporary/fetchTransactions",
    async (serverDate) => {
        // console.log(serverDate);
        const transactions = await getTransactions(serverDate);
        return transactions;
    }
);

export const createTransaction = createAsyncThunk(
    "temporary/createTransaction",
    async ({ data, serverDate }, thunkAPI) => {
    
        const transaction = await addTransaction(data);
      
        // thunkAPI.dispatch(fetchTransactions(serverDate));
        return transaction;
    }
);

export const changeTransaction = createAsyncThunk(
    "temporary/changeTransaction",
    async ({ id, data,serverDate },thunkAPI) => {
        const transaction = await editTransaction(id, data);
       
        // thunkAPI.dispatch(fetchTransactions(serverDate));
        return transaction;
    }
);

export const removeTransaction = createAsyncThunk(
    "temporary/removeTransaction",
    async ({id,serverDate},thunkAPI) => {
        const transaction = await deleteTransaction(id);
        // thunkAPI.dispatch(fetchTransactions(serverDate));
        return transaction;
    }
);

// create slice
const transactionSlice = createSlice({
    name: "temporary",
    initialState,
    reducers: {
        editActive: (state, action) => {
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

            })
            .addCase(removeTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            });
    },
});

export default transactionSlice.reducer;
export const { editActive, editInActive } = transactionSlice.actions;
