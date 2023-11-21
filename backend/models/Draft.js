const mongoose = require('mongoose')

const draftSchema = new mongoose.Schema(
  {
    title: {
      required: [true, 'Title is required'],
      type: String,
      trim: true, //
    },

    content: {
      type: String,
      required: [true, 'Content is required'],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    thumbnailImg: {
      type: String,
      required: [true, 'thumbnail of post is required'],
    },

    tags: {
      type: [String],
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

draftSchema.path('tags').validate(function (val) {
 
  if (val.length > 5) {
    throw new Error('You can not add more than 5 tags.')
  }
})

const Draft = mongoose.model('Draft', draftSchema)

module.exports = Draft
