import axios from "axios";

const createBasicAuthHeader = (username: string, password: string) => {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
};

// Create an Axios instance
const api = axios.create({
  baseURL: "http://bangladesh-001-site1.gtempurl.com",
  //baseURL: "http://http://localhost:7112",
  headers: {
    "Content-Type": "application/json",
    Authorization: createBasicAuthHeader("11190861", "60-dayfreetrial"),
  },
});

// Function to handle GET requests
export const get = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to handle POST requests
export const post = async (endpoint: string, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Optional: Function to handle PUT requests
export const put = async (endpoint: string, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Optional: Function to handle DELETE requests
export const del = async (endpoint: string, data = {}) => {
  try {
    const response = await api.delete(endpoint, { data });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Error handling
const handleError = (error: any) => {
  console.log("API call failed. Error:", error);
  // You can add more error handling logic here, like showing an alert to the user
  //throw error;
};
