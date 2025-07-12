import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addProduct,
    deleteProduct,
    editProduct,
    getProducts,
} from "./productsAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    accounts: [],
    isLoading: false,
    isError: false,
    error: "",
    editing: {},
};

// async thunks
export const fetchAccounts = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        const products = await getProducts();
       
        return products;
              }
);

export const createAccount = createAsyncThunk(
    "products/createProducts",
    async (data,thunkAPI) => {
        const products = await addProduct(data);
        toast.success('Account created successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, // Close after 3 seconds
          });
        //   thunkAPI.dispatch(fetchAccounts());
        return products;
        
    }
);

export const changeAccount = createAsyncThunk(
    "accounts/changeAccount",
    async ({ id, data }) => {
        const accounts = await editProduct(id, data);
        toast.success('Account updated successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, // Close after 3 seconds
          });
        return accounts;
    }
);

export const removeAccount = createAsyncThunk(
    "accounts/removeAccount",
    async (id) => {
        const account = await deleteProduct(id);
        toast.success('Account deleted successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, // Close after 3 seconds
          });
        return account;
    }
);

// create slice
const productSlice = createSlice({
    name: "product",
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
            .addCase(fetchAccounts.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.accounts = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
                state.accounts = [];
            })
            .addCase(createAccount.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
    
                state.isError = false;
                state.isLoading = false;
                state.accounts.unshift(action.payload);
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })
            .addCase(changeAccount.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(changeAccount.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;

                const indexToUpdate = state.accounts.findIndex(
                    (t) => t.id === action.payload.id
                );

                state.accounts[indexToUpdate] = action.payload;
            })
            .addCase(changeAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })
            .addCase(removeAccount.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(removeAccount.fulfilled, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = false;

                state.accounts = state.accounts.filter(
                    (t) => t.id !== action.meta.arg
                );
            })
            .addCase(removeAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            });
    },
});

export default productSlice.reducer;
export const { editActive, editInActive } = productSlice.actions;
