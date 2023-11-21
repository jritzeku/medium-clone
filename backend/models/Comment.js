const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
     

    storyId: {
      type: mongoose.Schema.Types.ObjectId,  
      required: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: false,
    },

    //this attribute to enable cascade deletion since not available in mongoDB
    ancestors: [mongoose.Schema.Types.ObjectId],

    user: {
     
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
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

commentSchema.pre('remove', async function (next) {
 
  try {
    //stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value
 
    await Comment.deleteMany({ ancestors: { $all: [this._id] } })
  } catch (error) {
    next(error)
  }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment

 