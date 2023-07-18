import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const statusResponse = error?.response?.status;
    if (statusResponse === 401 || statusResponse === 403) {
      alert(`Status ${statusResponse} ${error?.response?.data?.message}`);
    }

    return Promise.reject(error.response);
  }
);

const API_PATHS = {
  product: "https://ncpnjba9ml.execute-api.us-east-1.amazonaws.com",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: "https://44agkia734.execute-api.us-east-1.amazonaws.com",
  bff: " https://k1a7eqs00k.execute-api.us-east-1.amazonaws.com",
  cart: "http://ihartsykala-cart-api-prod.us-east-1.elasticbeanstalk.com",
};

export default API_PATHS;
