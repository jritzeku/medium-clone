const express = require('express')

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require('../controllers/notificationController')

const { authMw, adminMw } = require('../middlewares/userMw')

const notificationRoutes = express.Router()

notificationRoutes.get('/:id', authMw, getNotifications)

notificationRoutes.put(
  '/markNotificationRead/:id',
  authMw,
  markNotificationRead
)
notificationRoutes.put(
  '/markAllNotificationsRead',
  authMw,
  markAllNotificationsRead
)

module.exports = notificationRoutes
