const axios = require('axios');

function createHttpClient(options = {}) {
  const {
    timeout = 15000,
    headers,
    axiosInstance
  } = options;

  const client = axiosInstance || axios.create({
    timeout,
    headers
  });

  return {
    post(url, body, config) {
      return client.post(url, body, config);
    }
  };
}

module.exports = {
  createHttpClient
};

