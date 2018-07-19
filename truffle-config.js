require('babel-register');
require('babel-polyfill');



module.exports = {
  networks: {
      development: {
          host: "127.0.0.1",
          port: 7545,
          network_id: "*",
      },
      live: {
          host: "0.0.0.0",
          port: 8545,
          network_id: "*",
          gas: 3000000,
      }
  }
};