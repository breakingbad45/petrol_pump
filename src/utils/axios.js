import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://petrolpump.fahimtraders.com/backend",
});

export default axiosInstance;
