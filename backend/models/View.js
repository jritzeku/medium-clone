const mongoose = require('mongoose')

const viewSchema = new mongoose.Schema(
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
 
    viewsCount: {
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

const View = mongoose.model('View', viewSchema)

module.exports = View

 