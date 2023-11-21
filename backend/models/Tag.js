const mongoose = require('mongoose')
const Story = require('./Story')

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      default: '',
    },
    
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag

 