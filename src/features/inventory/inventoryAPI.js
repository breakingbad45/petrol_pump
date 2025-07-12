
import crypto from 'crypto-js';
import axiosInstance from "../../utils/axios";
import Swal from "sweetalert2";
/////////////////
const fuser = localStorage.getItem('user');
const user ='admin'
// console.log(user);

// const parseValue = JSON.parse(getValue);
// console.log(parseValue[0].Season);


// const record = await pb.collection('transactions').create(data);
export const getCatalogue = async () => {

  try {

    const response = await axiosInstance.get('inventory/getData.php');
 
    return response.data
} catch (error) {
   
   
}

};

export const getBidderinvoice = async ({timestamp,api_key,timestamps,record}) => {

};


export const addInvenetory = async ({ cart, paidValue, discountValue, loadUnloadValue }) => {
  const inv_id = 'INV' + Date.now().toString().slice(-8);
  const additional_data = `${discountValue}-${loadUnloadValue}-${paidValue}`;

  try {
      const response = await axiosInstance.post('/inventory/createData.php', {
          cart: cart,
          inv_id: inv_id,
          additional_data: additional_data,
          posted: "admin",
      });

      if (parseInt(discountValue) !== 0) {
          const payItem = {
              inv_id: inv_id,
              e_date: cart[0].e_date,
              ac_id: 2,
              remarks: cart[0].ac_id,
              payment: cart[0].sell_type === "PUR" ? 0 : discountValue,
              receive: cart[0].sell_type === "PUR" ? discountValue : 0,
              sell_type: 'INVTRANSACTION',
              posted: "admin",
          };
          const recItem = {
              inv_id: inv_id,
              e_date: cart[0].e_date,
              ac_id: cart[0].ac_id,
              remarks: "Discount",
              payment: cart[0].sell_type === "PUR" ? discountValue : 0,
              receive: cart[0].sell_type === "PUR" ? 0 : discountValue,
              sell_type: 'INVTRANSACTION',
              posted: "admin",
          };

          await axiosInstance.post('/transactions/createInvdata.php', payItem);
          await axiosInstance.post('/transactions/createInvdata.php', recItem);
      }

      if (parseInt(loadUnloadValue) !== 0) {
          const payItem = {
              inv_id: inv_id,
              e_date: cart[0].e_date,
              ac_id: 3,
              remarks: cart[0].ac_id,
              payment: cart[0].sell_type === "PUR" ? loadUnloadValue : 0,
              receive: cart[0].sell_type === "PUR" ? 0 : loadUnloadValue,
              sell_type: 'INVTRANSACTION',
              posted: "admin",
          };
          const recItem = {
              inv_id: inv_id,
              e_date: cart[0].e_date,
              ac_id: cart[0].ac_id,
              remarks: 'Load/Unload',
              payment: cart[0].sell_type === "PUR" ? 0 : loadUnloadValue,
              receive: cart[0].sell_type === "PUR" ? loadUnloadValue : 0,
              sell_type: 'INVTRANSACTION',
              posted: "admin",
          };

          await axiosInstance.post('/transactions/createInvdata.php', payItem);
          await axiosInstance.post('/transactions/createInvdata.php', recItem);
      }

      if (parseInt(paidValue) !== 0 && cart[0].bill_type === "CREDIT") {
          const recItem = {
              inv_id: inv_id,
              e_date: cart[0].e_date,
              ac_id: cart[0].ac_id,
              remarks: 'Cash',
              payment: cart[0].sell_type === "PUR" ? paidValue : 0,
              receive: cart[0].sell_type === "PUR" ? 0 : paidValue,
              sell_type: 'TRANSACTION',
              posted: "admin",
              
          };

          await axiosInstance.post('/transactions/createInvdata.php', recItem);
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Task completed..!",
        showConfirmButton: false,
        timer: 1500
      });
      return response.data;
  } catch (error) {
    Swal.fire({
        position: "center",
        icon: "warning",
        title: error,
        showConfirmButton: false,
        timer: 1500
      });
  }
};

//fetch a selected invoice data
export const fetchSelected = async (id) => {

  try {
    const response = await axiosInstance.get(`/inventory/selectData.php?id=${id}`);

 return response.data;
} catch (error) {
    console.error('Error:', error);
}
 
};


export const updateSelecetedinvoice = async ({ cart, id, paidValue, discountValue, loadUnloadValue }) => {

  const inv_id =id;

  const additional_data = `${discountValue}-${loadUnloadValue}-${paidValue}`;
  try {
    // console.log(filteredArray);
    const response = await axiosInstance.post('/inventory/updateData.php', {
      cart: cart,
      inv_id: id,
      additional_data:additional_data,
      posted: "admin",
      // Include inv_id in the request data
    });

    
    if (parseInt(discountValue) !== 0) {
      const payItem = {
          inv_id: inv_id,
          e_date: cart[0].e_date,
          ac_id: 2,
          remarks: cart[0].ac_id,
          payment: cart[0].sell_type === "PUR" ? 0 : discountValue,
          receive: cart[0].sell_type === "PUR" ? discountValue : 0,
          sell_type: 'INVTRANSACTION',
          posted: "admin",
      };
      const recItem = {
          inv_id: inv_id,
          e_date: cart[0].e_date,
          ac_id: cart[0].ac_id,
          remarks: "Discount",
          payment: cart[0].sell_type === "PUR" ? discountValue : 0,
          receive: cart[0].sell_type === "PUR" ? 0 : discountValue,
          sell_type: 'INVTRANSACTION',
          posted: "admin",
      };

      await axiosInstance.post('/transactions/createInvdata.php', payItem);
      await axiosInstance.post('/transactions/createInvdata.php', recItem);
  }

  if (parseInt(loadUnloadValue) !== 0) {
      const payItem = {
          inv_id: inv_id,
          e_date: cart[0].e_date,
          ac_id: 3,
          remarks: cart[0].ac_id,
          payment: cart[0].sell_type === "PUR" ? loadUnloadValue : 0,
          receive: cart[0].sell_type === "PUR" ? 0 : loadUnloadValue,
          sell_type: 'INVTRANSACTION',
          posted: "admin",
      };
      const recItem = {
          inv_id: inv_id,
          e_date: cart[0].e_date,
          ac_id: cart[0].ac_id,
          remarks: 'Load/Unload',
          payment: cart[0].sell_type === "PUR" ? 0 : loadUnloadValue,
          receive: cart[0].sell_type === "PUR" ? loadUnloadValue : 0,
          sell_type: 'INVTRANSACTION',
          posted: "admin",
      };

      await axiosInstance.post('/transactions/createInvdata.php', payItem);
      await axiosInstance.post('/transactions/createInvdata.php', recItem);
  }

  if (parseInt(paidValue) !== 0 && cart[0].bill_type === "CREDIT") {
      const recItem = {
          inv_id: inv_id,
          e_date: cart[0].e_date,
          ac_id: cart[0].ac_id,
          remarks: 'Cash',
          payment: cart[0].sell_type === "PUR" ? paidValue : 0,
          receive: cart[0].sell_type === "PUR" ? 0 : paidValue,
          sell_type: 'TRANSACTION',
          posted: "admin",
          
      };

      await axiosInstance.post('/transactions/createInvdata.php', recItem);
  }


  Swal.fire({
    position: "center",
    icon: "success",
    title: "Task completed..!",
    showConfirmButton: false,
    timer: 1500
  });
    return response.data
  } catch (error) {
    Swal.fire({
        position: "center",
        icon: "warning",
        title: error,
        showConfirmButton: false,
        timer: 1500
      });
  }
};



// export const updateSelecetedinvoice = async ({invoice_details,cart}) => {
//   console.log(cart);
//   const data = {
//     "date": "test",
//     "vehicle": "test",
//     "factory": "kxtmrstrwcvqas4",
//     "broker": "kxtmrstrwcvqas4",
//     "invoice": "test",
//     "rack": "test",

// };
//   try {

//     const record = await pb.collection('inventory').update('1wa0a5i0vw777p9', data);
//     console.log(record);
//   return record;
//   } catch (error) {
//     console.log(error);
//   }

//   };


export const deleteInvoice = async (id) => {

  try {
    const response = await axiosInstance.delete(`/inventory/deleteData.php?id=${id}`);
return response
} catch (error) {
    console.error('Error:', error);
}

 
};