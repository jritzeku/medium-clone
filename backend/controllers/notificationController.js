const expressAsyncHandler = require('express-async-handler')
const validateId = require('../utils/validateId')
const Notification = require('../models/Notification')
const notificationUpdates = require('../socketHandlers/updates/notifications')

const getNotifications = expressAsyncHandler(async (req, res) => {
  console.log('Inside getNotifications')
  const userId = req.user._id
  const { id: receiverId } = req.params
  const notifications = await Notification.find({
    receiver: userId,
  })
    .sort('-createdAt')
    .populate('user', '-password')
 
  res.status(201).json(notifications)
})

const markNotificationRead = expressAsyncHandler(async (req, res) => {
  const { id } = req.params

  const notification = await Notification.findByIdAndUpdate(id, {
    wasRead: true,
  })

  res.json(notification)
})

const markAllNotificationsRead = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id

  console.log('Inside markAllNotificationsRead')

  await Notification.updateMany(
    { receiver: userId },
    {
      $set: { wasRead: true },
    }
  )

  const notifications = await Notification.find({
    receiver: userId,
  })

  res.json(notifications)
})

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
}
