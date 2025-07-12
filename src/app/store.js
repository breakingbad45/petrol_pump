import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "../features/transaction/transactionSlice";
import dualtransactionReducer from "../features/dualtransaction/transactionSlice";
import loginReducer from "../features/login/loginSlice";
import accountReducer from "../features/accounts/accountsSlice";
import inventoryReducer from "../features/inventory/inventorySlice";

import productReducer from "../features/products/productsSlice"
export const store = configureStore({
    reducer: {
        transaction: transactionReducer,
        dualtransaction: dualtransactionReducer,
        login:loginReducer,
        account:accountReducer,
        inventory:inventoryReducer,
        product:productReducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck: false
    }),
});
