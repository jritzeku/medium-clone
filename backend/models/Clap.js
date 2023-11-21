const mongoose = require('mongoose')
const Story = require('./Story')

const clapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User is required'],
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Story is required'],
    },

    clapsByUser: {
      type: Number,
      default: 0,
      max: 10,
    },

    storyAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    createdDate: {
      type: Date,
      required: true,
      // default: Date.now,
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

clapSchema.pre('remove', async function (next) {
  const clapId = clapSchema.path(this.id)

  try {
    await Story.findOneAndUpdate(clapId, { $pull: { claps: this.id } })
  } catch (error) {
    next(error)
  }
})

const Clap = mongoose.model('Clap', clapSchema)

module.exports = Clap

 