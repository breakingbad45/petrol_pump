

import axiosInstance from "../../utils/axios";
import Swal from "sweetalert2";
const fuser = localStorage.getItem('user');
const user =JSON.parse(fuser)


// const record = await pb.collection('transactions').create(data);
export const getTransactions = async () => {

    try {
        const response = await axiosInstance.get('transactions/getData.php');
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }

};

export const addTransaction = async (data) => {
    const inv_id = 'TR' + Date.now().toString().slice(-7);
    console.log(inv_id);
    try {
        const response = await axiosInstance.post('/transactions/createData.php', {
            data:data,
            inv_id:inv_id,
            posted: user.username,
        });
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Task completed..!",
            showConfirmButton: false,
            timer: 1500
          });
       return response.data
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

export const editTransaction = async (id, data) => {
    try {
        const response = await axiosInstance.put('/transactions/updateData.php', {
            data:data,
            id:id
        });
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Task completed..!",
            showConfirmButton: false,
            timer: 1500
          });
          return response.data
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
        const response = await axiosInstance.delete(`/transactions/deleteData.php?id=${id}`);
        console.log(response);
        
    return response
    } catch (error) {
        console.error('Error:', error);
    }
};
