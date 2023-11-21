const mongoose = require('mongoose')

const listSchema = new mongoose.Schema(
  {
    name: {
      required: [true, 'List name is required'],
      type: String,
      default: 'All',
    },

    description: {
      type: String,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    stories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],

    isDefault: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    nameOfUser: {
      type: String,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

 
  },
  {
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

const List = mongoose.model('List', listSchema)

module.exports = List

 