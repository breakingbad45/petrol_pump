
import pb from "../../utils/pocketbase";
import Swal from "sweetalert2";
import axiosInstance from "../../utils/axios";
// const record = await pb.collection('transactions').create(data);
export const getAccounts = async () => {

    try {
        const response = await axiosInstance.get('machinereadings/getData.php');
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const addAccount = async (data) => {

    try {
        const response = await axiosInstance.post('/machinereadings/createReadings.php', {
            data:data,
        
        });
        console.log(response.data);
        // Handle success, show success message, update UI, etc.
      } catch (error) {
        console.error('Error:', error);
        // Handle error, show error message, etc.
      }
};

export const editAccount = async (id, data) => {
    try {
        const response = await axiosInstance.put('/machinereadings/updateData.php', {
            data:data,
            id:id
        });
        console.log(response.data);
        // Handle success, show success message, update UI, etc.
      } catch (error) {
        console.error('Error:', error);
        // Handle error, show error message, etc.
      }
};

export const deleteAccount = async (id) => {
    
    try {
        const response = await axiosInstance.delete(`/machinereadings/deleteData.php?id=${id}`);
    return response
    } catch (error) {
        console.error('Error:', error);
    }
};


// export const editAccount = async (id, data) => {
//     console.log(id,data);
//     const response = await pb.collection('accounts').update(id, data);
//     return response;
// };

// export const deleteAccount = async (id) => {
    
//     const response = await pb.collection('accounts').delete(id);

//     return response.data;
// };
