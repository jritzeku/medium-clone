import io from 'socket.io-client'

import { useDispatch, useSelector } from 'react-redux'
import { setNewNotification } from 'redux/slices/notificationSlices'

import store from '../redux/store/store'
let socket = null

export const connectWithSocketServer = (userAuth) => {
  const jwtToken = userAuth?.token

 
  socket = io('http://localhost:5001', {
    auth: {
      token: jwtToken,
  
    },
  })
 

  socket.on('connect', () => {
 //   console.log('successfully connected with socket.io server')
  })

  socket.on('notification', (data) => {
    const { notification } = data

  
    store.dispatch(setNewNotification(notification))
  })
}
