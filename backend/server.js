const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
// dotenv.config()
const connectDB = require('./config/db/connectDB')
const generateToken = require('./config/token/generateToken')
const userRoutes = require('./routes/userRoutes')
const { errorHandlerMw, notFoundMw } = require('./middlewares/errorMw')
const storyRoutes = require('./routes/storyRoutes')
const commentRoutes = require('./routes/commentRoutes')
const listRoutes = require('./routes/listRoutes')
const draftRoutes = require('./routes/draftRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

const ___dirname = path.resolve()

const apiLogs = fs.createWriteStream(
  path.join(___dirname, 'logs', 'apiLogs.log'),
  {
    flags: 'a',
  }
)

const http = require('http')

const socketServer = require('./socketServer')

dotenv.config()

const app = express()

connectDB()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny', { stream: apiLogs }))
}

app.use(express.json({ limit: '50mb' }))

app.use('/api/user', userRoutes)
app.use('/api/story', storyRoutes)

app.use('/api/comment', commentRoutes)
app.use('/api/list', listRoutes)
app.use('/api/draft', draftRoutes)
app.use('/api/notification', notificationRoutes)

if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static(path.join(___dirname, '/frontend/build')))

  //any route that is not API will be redirected to index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(___dirname, 'frontend', 'build', 'index.html'))
  )
}

app.use(notFoundMw)
app.use(errorHandlerMw)

// our server instance
const server = http.createServer(app)
socketServer.registerSocketServer(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
