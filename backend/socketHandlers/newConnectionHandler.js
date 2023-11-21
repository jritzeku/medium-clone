const serverStore = require('../serverStore')

const notificationUpdate = require('../socketHandlers/updates/notifications')

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user

  serverStore.addNewConnectedUser({
    socketId: socket.id,

    userId: userDetails.id,
  })

  notificationUpdate.notifyUser(userDetails.userId)
}

module.exports = newConnectionHandler
