const expressAsyncHandler = require('express-async-handler')
const Comment = require('../models/Comment')
const validateId = require('../utils/validateId')
const Story = require('../models/Story')
const notificationUpdates = require('../socketHandlers/updates/notifications')
const Notification = require('../models/Notification')
const User = require('../models/User')

const createComment = expressAsyncHandler(async (req, res) => {
  console.log('inside createComment controller')
  const { _id: loggedInUser } = req.user
  const { id: parentId } = req.params

  const { content } = req.body

  let commentAncestors = []

  const isStory = await Story.findById(parentId)

  if (isStory) {
    //root level comment

    commentAncestors.push(parentId)
  } else {
    //non root level...a comment reply
    const parentComment = await Comment.findById(parentId)
    commentAncestors = [...parentComment.ancestors, parentId]
  }

  const comment = await Comment.create({
    parentId,
    user: loggedInUser,
    content,
    ancestors: commentAncestors,
    storyId: commentAncestors[0],
  })

  const commenter = await User.findById(loggedInUser)
  /*
  -We ONLY want to create notifications for root level comments(commenting on story itself)
    ->if u want to send notifications for All comments (even replies to comments) on this
    story, then we just simply omit the if cond. here
  */
  if (comment.parentId.toString() === comment.ancestors[0].toString()) {
    const story = await Story.findById(commentAncestors[0].toString())

    const notification = await Notification.create({
      user: loggedInUser,
      receiver: story.user._id,
      resource: comment,
      resourceType: 'comment',
      resourceId: comment._id,
      description: `${commenter.firstName}  ${commenter.lastName} commented on your story "${isStory.title}"`,
    })

    notificationUpdates.notifyUser(story.user._id.toString(), notification)
  }

  res.json(comment)
})

const editComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const { _id: loggedInUserId } = req.user

  validateId(id)

  const comment = await Comment.findById(id)

  if (!comment) {
    res.status(404)
    throw new Error('Comment not found.')
  }

  if (!(comment.user.toString() === loggedInUserId.toString())) {
    res.status(422)

    throw new Error('Not allowed, you are not the owner of this content.')
  }

  comment.content = content || comment.content

  await comment.save()

  const notification = await Notification.findOne({ resourceId: comment._id })

  notification.resource = comment

  await notification.save()
  const story = await Story.findById(comment.ancestors[0].toString())

  notificationUpdates.notifyUser(story.user.toString(), notification)

  res.json(comment)
})

const deleteComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params
  validateId(id)
  const { _id: loggedInUserId } = req.user

  const comment = await Comment.findById(id)

  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }

  if (
    !(comment.user.toString() === loggedInUserId.toString() || req.user.isAdmin)
  ) {
    res.status(422)
    throw new Error(
      'Not allowed, you must be either admin or owner of this content.'
  )
  }

  await comment.remove()

  res.json({ msg: 'Comment was deleted.' })
})

const getAllComments = expressAsyncHandler(async (req, res) => {
  const comments = await Comment.find({}).sort('-createdAt')
  res.json(comments)
})

const getStoryComments = expressAsyncHandler(async (req, res) => {
  console.log('Inside getStoryComments controller')
  const { id } = req.params
  const comments = await Comment.find({ storyId: id })
    .populate('user', '-password')
    .sort('-createdAt')

  console.log('comments', comments)

  res.json(comments)
})

const getComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params

  const comment = await Comment.findById(id)

  if (!comment) {
    res.status(404)
    throw new Error('Comment was not found')
  }

  res.json(comment)
})

module.exports = {
  createComment,
  editComment,
  deleteComment,
  getAllComments,
  getComment,
  getStoryComments,
}

 