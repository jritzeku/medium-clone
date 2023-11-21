const expressAsyncHandler = require('express-async-handler')
const fs = require('fs')
const crypto = require('crypto')
const generateToken = require('../config/token/generateToken')
const User = require('../models/User')
const List = require('../models/List')
const cloudinaryUploadImg = require('../utils/cloudinaryUpload')
const validateId = require('../utils/validateId')
const Notification = require('../models/Notification')
const notificationUpdates = require('../socketHandlers/updates/notifications')

const registerUser = expressAsyncHandler(async (req, res) => {
  console.log('INside registerUser')
  const { firstName, lastName, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  })

  if (user) {
    const list = await List.create({
      name: 'Reading',
      description: 'General reading list(default)',
      user: user._id,
      isPrivate: false,
    })

    user.readingLists.push(list)
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      createdDate: user.createdDate,
      email: user.email,
      isAdmin: user.isAdmin,

      image: user.image,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('There was an error with registration.')
  }
})

const loginUser = expressAsyncHandler(async (req, res) => {
  console.log('Inside loginUser')
  const { email, password } = req.body

  //early exit cond.
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    //this is useful for checking if user logged in on backend but NOT thru middleware

    res.json({
      _id: user._id,
      name: user.name,
      createdDate: user.createdDate,
      email: user.email,
      isAdmin: user.isAdmin,

      image: user.image,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password was entered.')
  }
})

const getAllUsers = expressAsyncHandler(async (req, res) => {
  console.log('In getAllUsers')

  const users = await User.find({})

  res.json(users)
})

const getUser = expressAsyncHandler(async (req, res) => {
  console.log('In getUser')

  const { id } = req.params
  validateId(id)

  const user = await User.findById(id)
    .select('-password')
    .populate('stories')
    .populate('followers')
    .populate('following')
    .populate('readingLists')
    .populate('savedReadingLists')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json(user)
})

const editProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params
  const { _id: loggedInUserId } = req.user
  console.log('In editProfile')

  const { firstName, lastName, blurb, aboutMe } = req.body

  let localPath
  let imgUploaded
  if (req?.file?.filename) {
    //get path to img
    localPath = `public/images/users/${req?.file?.filename}`
    //upload to cloudinary
    imgUploaded = await cloudinaryUploadImg(localPath)
  }

  const user = await User.findById(loggedInUserId)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (!(id.toString() === loggedInUserId.toString())) {
    res.status(422)
    throw new Error('Not allowed, this is not your account.')
  }

  console.log('imgUploaded.url:', imgUploaded?.url)

  user.firstName = firstName || user.firstName
  user.lastName = lastName || user.lastName
  user.blurb = blurb || user.blurb
  user.aboutMe = aboutMe || user.aboutMe

  user.image = imgUploaded?.url || user.image
  user.profileSet = true

  await user.save()

  //we return only relevant fields , hiding the pw and other sensitive data
  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    aboutMe: user.aboutMe,
    image: user.image,
  })
})
 
const editUserAdmin = expressAsyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  //since admin can update potentially every field, we just use findByIdAndUpdate() for convenience
  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    {
      ...req.body,
    },
    {
      new: true,
    }
  )

  //since we are grabbing id from req.body, no need to set 404 code or throw error
  res.json(updatedUser)
})

 
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params

  validateId(id)

  const user = await User.findById(id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  //NOTE: in our User model, we have cascade delete set up to delete all documents
  //created by user  before he/she is deleted
  user.remove()

  res.json(user)
})

const followUser = expressAsyncHandler(async (req, res) => {
  console.log('In followUser')
  const { id: targetId } = req.params
  const { _id: loggedInUserId } = req.user

  validateId(targetId)

  if (targetId.toString() === loggedInUserId.toString()) {
    res.status(404)
    throw new Error('Follow and unfollow can only be done to others accounts.')
  }

  const user = await User.findById(targetId)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const isFollowing = user.followers.includes(loggedInUserId.toString())

  if (isFollowing) {
    res.status(422)
    throw new Error('You already follow this user')
  }

  const follower = await User.findByIdAndUpdate(
    targetId,
    {
      $push: { followers: loggedInUserId },
    },
    { new: true }
  )
  //update follower
  const followee = await User.findByIdAndUpdate(
    loggedInUserId,
    {
      $push: { following: targetId },
    },
    { new: true }
  )

  const notification = await Notification.create({
    user: loggedInUserId,
    receiver: targetId,
    resourceType: 'follow',

    resourceId: loggedInUserId,
    description: `${followee.firstName}  ${followee.lastName} followed you. `,
  })

  notificationUpdates.notifyUser(targetId, notification)

  res.json(`You are now following ${user.firstName}`)
})

const unfollowUser = expressAsyncHandler(async (req, res) => {
  console.log('In unfollowUser')
  const { id: targetId } = req.params
  const { _id: loggedInUserId } = req.user

  validateId(targetId)

  if (targetId.toString() === loggedInUserId.toString()) {
    res.status(404)
    throw new Error('Follow and unfollow can only be done to others accounts.')
  }

  const user = await User.findById(targetId)

  const isFollowing = user.followers.includes(loggedInUserId.toString())

  if (!isFollowing) {
    res.status(422)
    throw new Error('You must first follow this user in order to unfollow.')
  }

  //update followee
  await User.findByIdAndUpdate(
    targetId,
    {
      $pull: { followers: loggedInUserId },
    },
    { new: true }
  )

  //update follower
  await User.findByIdAndUpdate(
    loggedInUserId,
    {
      $pull: { following: targetId },
    },
    { new: true }
  )

  res.json(`You are no longer following ${user.firstName}`)
})
const addTagToRecommendations = expressAsyncHandler(async (req, res) => {
  console.log('Inside addStoryToRecomendations')

  const { _id: loggedInUserId } = req.user
  const { tag } = req.body
  // const { id: storyId } = req.params

  const user = await User.findById(loggedInUserId)

  if (user.recommendedTopics.includes(tag)) {
    res.status(422)
    throw new Error('This tag already is in recommendation')
  } else {
    user.recommendedTopics.push(tag)
    await user.save()
    res.json(user)
  }
})

const removeTagFromRecommendations = expressAsyncHandler(async (req, res) => {
  console.log('Inside removeStoryFromRecomendations')

  const { _id: loggedInUserId } = req.user
  // const { id: storyId } = req.params
  const { tag } = req.body

  const user = await User.findById(loggedInUserId)

  if (!user.recommendedTopics.includes(tag)) {
    res.status(422)
    throw new Error('This tag is not in  recommendations')
  } else {
    user.recommendedTopics.pop(tag)
    await user.save()
    res.json(user)
  }
})

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  editUserAdmin,
  editProfile,
  deleteUser,
  followUser,
  unfollowUser,

  addTagToRecommendations,
  removeTagFromRecommendations,
}

 