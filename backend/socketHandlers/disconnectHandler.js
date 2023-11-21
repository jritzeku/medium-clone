const serverStore = require("../serverStore");

const disconnectHandler = (socket) => {
  console.log('Inside disconnectHandler')
  serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHandler;
