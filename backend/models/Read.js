const mongoose = require('mongoose')

const readSchema = new mongoose.Schema(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    storyAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    readsCount: {
      type: Number,
      default: 0,
    },
    createdDate: {
      type: Date,
      required: true,
    },
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

const Read = mongoose.model('Read', readSchema)

module.exports = Read
