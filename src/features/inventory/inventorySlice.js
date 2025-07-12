import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    updateSelecetedinvoice,
  addInvenetory,
  fetchSelected,
  getCatalogue,
  getBidderinvoice,

  deleteInvoice
  ,
} from "./inventoryAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import "react-toastify/dist/ReactToastify.css";
import { act } from "react-dom/test-utils";

const initialState = {
  
  invoicedetail: [],
  draft: [],
  biddersummary: [],
  bidderinvoice: [],
  factorysummary: [],
  cart: [],
  cartedit:[],
  catalogue: [],
  loaddata :"",
  isLoading: false,
  iseditLoading: false,
  isError: false,
  error: "",
  edit_invid: "",
  editing: {},
  loadUnloadValue: 0,
  discountValue: 0,
  paidValue: 0
  
};

export const fetchCatalogue = createAsyncThunk(
 
  "catalogue/fetchCatalogue",
  async () => {
    const catalogue = await getCatalogue();

    return catalogue;
  }
);


export const fetchBidderinvoice = createAsyncThunk(
  "catalogue/fetchBidderinvoice",
  async ({timestamp,api_key,timestamps,record}) => {
    const bidderinvoice = await getBidderinvoice({timestamp,api_key,timestamps,record});

    return bidderinvoice;
  }
);


export const createCatalogue = createAsyncThunk(
  "catalogue/createCatalogue",
  async ({cart,paidValue,discountValue,loadUnloadValue}) => {
    console.log('cafg');
    
    const accounts = await addInvenetory({cart,paidValue,discountValue,loadUnloadValue});
    // toast.success("Entry created successfully!", {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000, // Close after 3 seconds
    // });
    // thunkAPI.dispatch(fetchCatalogue({timestamp,api_key,timestamps,serverDate}));
  
    return accounts;
  }
);

export const selectedData = createAsyncThunk(
  "catalogue/selectedCatalogue",
  async (id) => {
    const fetchselected = await fetchSelected(id);
    
    return fetchselected;
  }
);


export const updateInvoice = createAsyncThunk(
    "catalogue/updateInvoice",
    async ({cart,id,paidValue,discountValue,loadUnloadValue}) => {
        const updateinvoice = await updateSelecetedinvoice({cart,id,paidValue,discountValue,loadUnloadValue});
      
        return updateinvoice;
     
    }
  );


export const removeInvoice = createAsyncThunk(
  "catalogue/removeInvoice",
  async ({id}, thunkAPI) => {
    const deletein = await deleteInvoice(id);
    
    // After removing the invoice, fetch the updated catalog data
    thunkAPI.dispatch(fetchCatalogue());

    return deletein;
  }
);

// create slice
const InventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      const existingItemIndex = state.cart.findIndex(
        (item) => item.product_id === newItem.product_id && item.unit1 === newItem.unit1 && item.unit2 === newItem.unit2
      );
      // state.cart.push(newItem);
      if (existingItemIndex !== -1) {
        alert('Already exists in the cart.');
      } else {
       
        state.cart.push(newItem);
      }
    },
    editCartItemByLot: (state, action) => {
      const { id, inputsForm } = action.payload;
      const itemIndexToEdit = state.cart.findIndex((item) => item.id === id);

      if (itemIndexToEdit !== -1) {
        state.cart[itemIndexToEdit] = inputsForm;
      }
    },
    deleteCart: (state, action) => {
      const lotToDelete = action.payload;
     
      state.cart = state.cart.filter((item) => !(item.id === lotToDelete.id ));   
    },
    editcartActive: (state, action) => {

      state.cartedit = action.payload;
    },
    editcartInActive: (state) => {
      state.cartedit = {};
    },
    editActive: (state, action) => {

      state.editing = action.payload;
    },
    editInActive: (state) => {
      state.editing = {};
    },
    clearCart: (state) => {
        // Clear the entire cart
        state.cart = [];
        state.paidValue =0;
        state.discountValue =0;
        state.loadUnloadValue=0;
        state.editing = {};
      },
      updateLoadUnloadValue: (state, action) => {
        state.loadUnloadValue = action.payload;
      },
      updateDiscountValue: (state, action) => {
        state.discountValue = action.payload;
      },
      updatePaidValue: (state, action) => {
        state.paidValue = action.payload;
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectedData.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(selectedData.fulfilled, (state, action) => {

        state.isError = false;
        state.isLoading = false;
        state.cart = action.payload;
        state.invoicedetail=action.payload;
        state.loaddata=action.payload[0].additional_data;
        state.edit_invid=action.payload[0].inv_id;
     
      })
      .addCase(selectedData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
        state.cart = [];
        state.invoicedetail = [];
      })
      .addCase(fetchCatalogue.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchCatalogue.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.catalogue = action.payload;
      })
      .addCase(fetchCatalogue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
        state.catalogue = [];
      })
     
      .addCase(fetchBidderinvoice.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchBidderinvoice.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.bidderinvoice = action.payload;
      })
      .addCase(fetchBidderinvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
        state.draft = [];
      })

    
      .addCase(createCatalogue.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(createCatalogue.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.cart=[];
        state.loadUnloadValue=0;
        state.discountValue=0;
        state.paidValue=0;
        // state.accounts.unshift(action.payload);
      })
      .addCase(createCatalogue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.cart=[];
        state.loadUnloadValue=0;
        state.discountValue=0;
        state.paidValue=0;
        state.loaddata="";
        // state.accounts.unshift(action.payload);
      })


      
  },
});

export default InventorySlice.reducer;
export const {
  editCartItemByLot,
  editcartInActive,
  editcartActive,
  editActive,
  editInActive,
  addToCart,
  deleteCart,
  clearCart,
  updatePaidValue,
  updateDiscountValue,
  updateLoadUnloadValue
} = InventorySlice.actions;
