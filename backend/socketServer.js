const authSocket = require('./middlewares/authSocket')
const newConnectionHandler = require('./socketHandlers/newConnectionHandler')
const disconnectHandler = require('./socketHandlers/disconnectHandler')

const serverStore = require('./serverStore')

const registerSocketServer = (server) => {
  console.log('Inside registerSocketServer()')

  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

 

  serverStore.setSocketServerInstance(io)

 

  io.use((socket, next) => {
    authSocket(socket, next)
  })

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers()
    io.emit('online-users', { onlineUsers })
  }

  io.on('connection', (socket) => {
    newConnectionHandler(socket, io)
    emitOnlineUsers()

    socket.on('disconnect', () => {
      disconnectHandler(socket)
    })
  })

  setInterval(() => {
    emitOnlineUsers()
  }, [1000 * 8])
}

module.exports = {
  registerSocketServer,
}
