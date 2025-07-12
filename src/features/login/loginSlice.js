import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    loginFunction,
} from "./loginApi";

const initialState = {
    userdata: [],
    isLoading: false,
    isError: false,
    error: "",
    isLogged: false,
};

// async thunks
export const loginVerify = createAsyncThunk(
    "login/loginVerify",
    async (data ) => {
        const login = await loginFunction(data);

        return login;
    }
);


// create slice
const loginSlice = createSlice({
    name: "login",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(loginVerify.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(loginVerify.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.error='';
                state.userdata = action.payload.record;
            })
            .addCase(loginVerify.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
                state.userdata =[];
            })
              },
});

export default loginSlice.reducer;
