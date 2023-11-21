const mongoose = require('mongoose')
const Comment = require('./Comment')

const storySchema = new mongoose.Schema(
  {
    title: {
      required: [true, 'Title is required'],
      type: String,
      trim: true, //??
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

    nameOfUser: {
      type: String,
      required: [true, 'Name of author is required'],
    },

    thumbnailImg: {
      type: String,
      required: [true, 'thumbnail of story is required'],
    },

    tags: {
      type: [String],
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    claps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clap',
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'View',
      },
    ],

    reads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Read',
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

/*
-We identify the property with path()  and then check length with validatE() 
  ->we are able to get the array length with 'val' 
*/
storySchema.path('tags').validate(function (val) {
  if (val.length > 5) {
    throw new Error('You can not add more than 5 tags.')
  }
})

storySchema.pre('remove', async function (next) {
  try {
    //remove child documents
    await Comment.deleteMany({ parentId: this.id })
  } catch (error) {
    next(error)
  }
})

const Story = mongoose.model('Story', storySchema)

module.exports = Story
