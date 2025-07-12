
import axiosInstance from "../../utils/axios";
// const record = await pb.collection('transactions').create(data);
export const getProducts = async () => {

    try {
        const response = await axiosInstance.get('products/getData.php');
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const addProduct = async (data) => {

    try {
        const response = await axiosInstance.post('/products/createData.php', {
            data:data,
        
        });
        console.log(response.data);
        // Handle success, show success message, update UI, etc.
      } catch (error) {
        console.error('Error:', error);
        // Handle error, show error message, etc.
      }
};

export const editProduct= async (id, data) => {
    try {
        const response = await axiosInstance.put('/products/updateData.php', {
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

export const deleteProduct = async (id) => {
    
    try {
        const response = await axiosInstance.delete(`/products/deleteData.php?id=${id}`);
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
