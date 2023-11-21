const Notification = require('../../models/Notification')
const serverStore = require('../../serverStore')

const notifyUser = async (userId, notification) => {
  //console.log('inside notifyUser')

  try {
    // find all active connections of specific userId
    const receiverList = serverStore.getActiveConnections(userId)

    const io = serverStore.getSocketServerInstance()

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit('notification', {
        notification: notification ? notification : {},
      })
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  notifyUser,
}
