

import axiosInstance from "../../utils/axios";
import Swal from "sweetalert2";
const fuser = localStorage.getItem('user');
const user =JSON.parse(fuser)

// const record = await pb.collection('transactions').create(data);
export const getTransactions = async (serverDate) => {
// console.log('ia mscalle');
try {
    const response = await axiosInstance.get('/dualtransaction/getData.php');
    return response.data;
    // Handle success, show success message, update UI, etc.
  } catch (error) {
    console.error('Error:', error);
    // Handle error, show error message, etc.
  }

};

export const addTransaction = async (data) => {
    const cusid = 'DTR' + Date.now().toString().slice(-7);
    const formdata1 = {
        inv_id: cusid,
        e_date: data.e_date,
        ac_id: data.rec_id,
        payment: 0,
        receive: data.amount,
        remarks: data.remarks,
        sell_type: data.sell_type,
        posted: user.username,
    };

    const formdata2 = {
        inv_id: cusid,
        e_date: data.e_date,
        ac_id: data.pay_id,
        payment: data.amount,
        receive: 0,
        remarks: data.remarks,
        sell_type: data.sell_type,
        posted: user.username,
    };

    try {
        const response = await axiosInstance.post('/dualtransaction/createData.php', {
            formdata1:formdata1,
            formdata2:formdata2
        });
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Task completed..!",
            showConfirmButton: false,
            timer: 1500
          });
        // Handle success, show success message, update UI, etc.
      } catch (error) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 1500
          });
        // Handle error, show error message, etc.
      }
};

export const editTransaction = async (id, data,p_id,r_id) => {

    const formdata = {

        ac_id: data.rec_id,
        payment: 0,
        receive:data.amount,
        remarks: data.remarks,
  
    };
    const formdata1 = {

        ac_id: data.pay_id,
        payment: data.amount,
        receive:0,
        remarks: data.remarks,
  
    };
    try {
        const response = await axiosInstance.put('/dualtransaction/updateData.php', {
            formdata:formdata,
            formdata1:formdata1,
            r_id:r_id,
            p_id:p_id

        });
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Task completed..!",
            showConfirmButton: false,
            timer: 1500
          });
        // Handle success, show success message, update UI, etc.
      } catch (error) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 1500
          });
        // Handle error, show error message, etc.
      }
};

export const deleteTransaction = async (id) => {
    try {
        const response = await axiosInstance.delete(`/dualtransaction/deleteData.php?id=${id}`);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Task completed..!",
            showConfirmButton: false,
            timer: 1500
          });
        return response
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
