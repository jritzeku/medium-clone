const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    description: {
      //i.e 'John commented', 'John followed you'
      type: String,
    },

    //OPTIONAL; not needed for things like when user started following you
    resource: {
      type: Object,
    },

    resourceType: {
      type: String,
    },
    resourceId: {
      //OPTIONAL ?
      type: mongoose.Schema.Types.ObjectId,
    },

    /*
  -needed so when we click on notification, goes to the url 
    ->see Udemy's notification mechanism for reference
  */

    contentUrl: {
      type: String,
    },

    wasRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
