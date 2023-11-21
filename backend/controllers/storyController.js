const expressAsyncHandler = require('express-async-handler')
const Story = require('../models/Story')
const Clap = require('../models/Clap')
const View = require('../models/View')
const Read = require('../models/Read')
const User = require('../models/User')
const Draft = require('../models/Draft')
const validateId = require('../utils/validateId')
const fs = require('fs')
const cloudinaryUploadImg = require('../utils/cloudinaryUpload')
var ObjectId = require('mongoose').Types.ObjectId
const getDaysArray = require('../utils/getDaysArray')
const notificationUpdates = require('../socketHandlers/updates/notifications')
const Notification = require('../models/Notification')

const createStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside createStory')
  const { _id: loggedInUserId } = req?.user

  const { title, content, tags, image, draftId } = req?.body

  console.log('title', title)
  console.log('image', image)
  console.log('tags', tags)

  console.log('draftId: ' + draftId)

  if (typeof tags === 'string') {
    tagsArray = tags.split(',')
  } else {
    tagsArray = tags
  }

  let imgUploaded

  if (image) {
    imgUploaded = image
  } else {
    //get path to img
    const localPath = `public/images/posts/${req?.file?.filename}`
    //upload to cloudinary
    let result = await cloudinaryUploadImg(localPath)
    imgUploaded = result?.url
    console.log('imgUploaded', imgUploaded)
  }

  const story = await Story.create({
    title,
    content,
    tags: tagsArray,
    thumbnailImg: imgUploaded,
    user: loggedInUserId,
    nameOfUser: `${req.user.firstName} ${req.user.lastName}`,
  })

  if (draftId) {
    await Draft.findByIdAndDelete(draftId)
  }

  res.status(201).json(story)
})

const editStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside editStory')
  const { id } = req.params
  const { _id: loggedInUserId } = req.user

  const { title, content, tags, image } = req.body
  console.log('reqbody', req.body)

  validateId(id)

  if (typeof tags === 'string') {
    tagsArray = tags.split(',')
  } else {
    tagsArray = tags
  }

  const story = await Story.findById(id)

  if (!(story.user.toString() === loggedInUserId.toString())) {
    res.status(422)
    throw new Error('Not allowed, you are not the owner of this content.')
  }

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  let imgUploaded

  if (image) {
    imgUploaded = image
  } else {
    //get path to img
    const localPath = `public/images/posts/${req?.file?.filename}`
    //upload to cloudinary
    let result = await cloudinaryUploadImg(localPath)
    imgUploaded = result?.url
  }

  story.title = title || story.title
  story.thumbnailImg = imgUploaded || story.thumbnailImg
  story.content = content || story.content
  story.tags = tagsArray || story.tags

  await story.save()
  res.json(story)
})

const deleteStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside deleteStory')
  const { id } = req.params
  const { _id: loggedInUserId } = req.user

  validateId(id)

  const story = await Story.findById(id)

  if (
    !(story.user.toString() === loggedInUserId.toString() || req.user.isAdmin)
  ) {
    res.status(422)
    throw new Error(
      'Not allowed, you must be either admin or owner of this content.'
    )
  }

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  await story.remove()

  res.json(story)
})

const getStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getStories')

  console.log(req.query)
  const keyword = req.query.keyword
    ? [
        {
          title: {
            //reason for using regex is so we dont have to type EXACT thing to perform search
            $regex: req.query.keyword,
            $options: 'i', //case insensitive
          },
        },

        {
          nameOfUser: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        },

        {
          tags: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        },
      ]
    : {}

  let stories

  if (JSON.stringify(keyword) === '{}') {
    stories = await Story.find({})
      .populate('user', '-password')
      .populate('comments')
      .sort('-createdAt')
  } else {
    stories = await Story.find({
      $or: [keyword[0], keyword[1], keyword[2]],
    })
      .populate('user', '-password')
      .populate('comments')
      .sort('-createdAt')
  }

  res.json(stories)
})

const getRecommendedStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getRecommendedStories')
  const { topic } = req.params

  let loggedInUser = req.user

  let topicSelected = topic.charAt(0).toUpperCase() + topic.slice(1)

  let topicsToFetch = loggedInUser.recommendedTopics

  let result
  let stories

  console.log(topicsToFetch)

  if (topicSelected == 'Following') {
    topicsToFetch = [topicSelected]

    const user = await User.findById(req.user)

    stories = await Story.find({
      user: { $in: user.following },
    })

    result = [...stories]

    console.log(user.following)
  } else {
    // topicsToFetch = [...topicsToFetch]
    topicsToFetch = [topicSelected]

    stories = await Story.find({
      user: { $ne: loggedInUser._id },
      tags: { $in: topicsToFetch },
    })
      .populate('user', '-password')
      .populate('comments')
      .sort('-createdAt')

    result = [...stories]
  }

  res.json(result)
})

const getTrendingStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside  getTrendingStories')
  const trendingStories = await Story.find({}).limit(6)
  res.json(trendingStories)
})

const getAllTags = expressAsyncHandler(async (req, res) => {
  console.log('Inside  getAllTags')
  let stories = await Story.find({})

  let allTags = []

  stories.forEach((story) => {
    allTags = [...allTags, ...story.tags]
  })

  let uniqueTags = [...new Set(allTags)]

  res.json(uniqueTags)
})

const getStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside getStory')
  const { id } = req.params

  const story = await Story.findById(id)
    .populate('user', '-password')
    .populate('claps')
    .populate('comments')

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  res.json(story)
})

const addClap = expressAsyncHandler(async (req, res) => {
  console.log('Inside addClap controller')

  const { id: storyId } = req.params
  const loggedInUserId = req.user._id

  const story = await Story.findById(storyId)

  const clapper = await User.findById(loggedInUserId)

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  if (loggedInUserId.toString() === story.user.toString()) {
    return res.json({ msg: 'You cant clap on own story.' })
  }

  //if user has clapped on this story, modify existing clap
  const clapped = await Clap.findOne({ story: storyId, user: loggedInUserId })

  let newClap

  if (!clapped) {
    const date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    //add new clap for this story
    newClap = await Clap.create({
      clapsByUser: 1,
      user: loggedInUserId,
      story: storyId,
      storyAuthor: story.user,
      createdDate: new Date(`${month}/${day}/${year}`),
    })

    story.claps.push(newClap._id)

    await story.save()
  } else {
    clapped.clapsByUser++
    await clapped.save()
  }

  let resourceId, resource

  if (newClap) {
    resourceId = newClap._id
    resource = newClap
  } else {
    resourceId = clapped._id
    resource = clapped
  }

  const notification = await Notification.create({
    user: loggedInUserId,
    receiver: story.user._id,
    resourceType: 'clap',
    resource: resource,
    resourceId: resourceId,
    description: `${clapper.firstName}  ${clapper.lastName} clapped on your story "${story.title}"`,
  })

  notificationUpdates.notifyUser(story.user._id.toString(), notification)

  if (newClap) {
    res.json(newClap)
  } else {
    res.json(clapped)
  }
})

const getClapsOnStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside getClapsOnStory')
  const { id: storyId } = req.params

  const claps = await Clap.find({ story: storyId }).populate('story')

  if (!claps) {
    res.status(404)
    throw new Error('Clap not found')
  }

  res.json(claps)
})

const removeUsersClaps = expressAsyncHandler(async (req, res) => {
  console.log('Inside removeUsersClaps')
  const { id: storyId } = req.params
  const loggedInUserId = req.user._id

  validateId(storyId)

  const story = await Story.findById(storyId)

  if (!story) {
    res.status(404)
    throw new Error('Clap not found')
  }

  const clapped = await Clap.findOne({ story: storyId, user: loggedInUserId })

  if (!clapped) {
    res.status(422)

    throw new Error('No claps exist on this story by you.')
  } else {
    await clapped.remove()
    res.json(clapped)
  }
})

const markStoryViewed = expressAsyncHandler(async (req, res) => {
  console.log('Inside markStoryViewed')

  const { id: storyId } = req.params
  const { _id: userId } = req.user

  let story = await Story.findById(storyId)

  //cannot accumulate view on own story
  if (story.user.toString() === userId.toString()) {
    return
  }

  let view = await View.findOne({ story: storyId, user: userId })

  if (view) {
    view.viewsCount = view.viewsCount + 1

    await view.save()
    res.json(view)
  } else {
    const date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    const newView = await View.create({
      story: storyId,
      user: userId,
      viewsCount: 1,
      storyAuthor: story.user,
      createdDate: new Date(`${month}/${day}/${year}`),
    })

    await newView.save()
    res.json(newView)
  }
})

const markStoryRead = expressAsyncHandler(async (req, res) => {
  console.log('Inside markStoryRead')

  const { id: storyId } = req.params
  const { _id: userId } = req.user

  let story = await Story.findById(storyId)

  //cannot accumulate read on own story
  if (story.user.toString() === userId.toString()) {
    return
  }

  let read = await Read.findOne({ story: storyId, user: userId })

  if (read) {
    read.readsCount = read.readsCount + 1

    await read.save()
    res.json(read)
  } else {
    const date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    //new read
    const newRead = await Read.create({
      story: storyId,
      user: userId,
      readsCount: 1,
      storyAuthor: story.user,
      createdDate: new Date(`${month}/${day}/${year}`),
    })

    await newRead.save()
    res.json(newRead)
  }
})

const getView = expressAsyncHandler(async (req, res) => {
  console.log('Inside  getView')
  const { id: storyId } = req.params
  const { _id: userId } = req.user

  const view = await View.findOne({ user: userId, story: storyId })

  if (!view) {
    res.status(404)
    throw new Error('no view not found.')
  }

  res.json(view)
})

const getMyViewedStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getMyViewedStories ')

  const { _id: userId } = req.user

  let { date } = req.params

  if (date) {
    date = new Date(date.split('-').join('/'))
  }

  let storiesViewed = await View.find({ storyAuthor: userId })
    .populate('story')
    .sort('createdAt')

  if (!storiesViewed) {
    res.status(404)
    throw new Error('You have no stories viewed')
  }

  let user = await User.findById(userId)

  let firstStoryDate = storiesViewed[0]?.createdDate

  let dates

  if (date) {
    dates = getDaysArray(
      date,
      new Date(date.getFullYear(), date.getMonth() + 1, 0).toString()
    )
  } else {
    dates = getDaysArray(
      firstStoryDate,
      new Date(
        firstStoryDate.getFullYear(),
        firstStoryDate.getMonth() + 1,
        1
      ).toString()
    )
  }

  //transform dates to add 'viewsCount' property
  let viewDates = dates.map((date) => ({ createdDate: date, viewsCount: 0 }))

  let combinedDates = Object.values(
    storiesViewed.reduce((r, o) => {
      r[o.createdDate] = r[o.createdDate] || {
        createdDate: new Intl.DateTimeFormat('en-US').format(
          new Date(o.createdDate)
        ),
        viewsCount: 0,
      }
      r[o.createdDate].viewsCount += +o.viewsCount
      return r
    }, {})
  )

  for (let i = 0; i < viewDates.length; i++) {
    let foundViewed = combinedDates.find(
      (r) => r.createdDate.toString() === viewDates[i].createdDate.toString()
    )

    if (foundViewed) {
      viewDates[i] = foundViewed
    }
  }

  res.json(viewDates)
})

const getMyReadStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getMyReadStories ')

  const { _id: userId } = req.user

  let { date } = req.params

  if (date) {
    date = new Date(date.split('-').join('/'))
  }

  let storiesRead = await Read.find({ storyAuthor: userId })
    .populate('story')
    .sort('createdAt')

  if (!storiesRead) {
    res.status(404)
    throw new Error('You have no stories read')
  }

  let user = await User.findById(userId)

  let firstStoryDate = storiesRead[0]?.createdDate

  let dates

  if (date) {
    dates = getDaysArray(
      date,
      new Date(date.getFullYear(), date.getMonth() + 1, 0).toString()
    )
  } else {
    dates = getDaysArray(
      firstStoryDate,
      new Date(
        firstStoryDate.getFullYear(),
        firstStoryDate.getMonth() + 1,
        1
      ).toString()
    )
  }

  let readDates = dates.map((date) => ({ createdDate: date, readsCount: 0 }))

  let combinedDates = Object.values(
    storiesRead.reduce((r, o) => {
      r[o.createdDate] = r[o.createdDate] || {
        // createdDate: o.createdDate,
        createdDate: new Intl.DateTimeFormat('en-US').format(
          new Date(o.createdDate)
        ),
        readsCount: 0,
      }
      r[o.createdDate].readsCount += +o.readsCount
      return r
    }, {})
  )

  for (let i = 0; i < readDates.length; i++) {
    let foundRead = combinedDates.find(
      (r) => r.createdDate.toString() === readDates[i].createdDate.toString()
    )

    if (foundRead) {
      readDates[i] = foundRead
    }
  }

  res.json(readDates)
})

const getMyClappedStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getMyClappedStories ')

  const { _id: userId } = req.user

  let { date } = req.params

  if (date) {
    date = new Date(date.split('-').join('/'))
  }

  let storiesClapped = await Clap.find({ storyAuthor: userId })
    .populate('story')
    .sort('createdAt')

  if (!storiesClapped) {
    res.status(404)
    throw new Error('You have no stories clapped')
  }

  let user = await User.findById(userId)

  let firstStoryDate = storiesClapped[0]?.createdDate

  let dates

  if (date) {
    dates = getDaysArray(
      date,
      new Date(date.getFullYear(), date.getMonth() + 1, 0).toString()
    )
  } else {
    dates = getDaysArray(
      firstStoryDate,
      new Date(
        firstStoryDate.getFullYear(),
        firstStoryDate.getMonth() + 1,
        1
      ).toString()
    )
  }

  let clapDates = dates.map((date) => ({ createdDate: date, clapsByUser: 0 }))

  let combinedDates = Object.values(
    storiesClapped.reduce((r, o) => {
      r[o.createdDate] = r[o.createdDate] || {
        createdDate: new Intl.DateTimeFormat('en-US').format(
          new Date(o.createdDate)
        ),
        clapsByUser: 0,
      }
      r[o.createdDate].clapsByUser += +o.clapsByUser
      return r
    }, {})
  )

  for (let i = 0; i < clapDates.length; i++) {
    let foundClapped = combinedDates.find(
      (r) => r.createdDate.toString() === clapDates[i].createdDate.toString()
    )

    if (foundClapped) {
      clapDates[i] = foundClapped
    }
  }

  res.json(clapDates)
})
const getUserStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getUserStories controller')
  const { id: userId } = req.params

  const userStories = await Story.find({ user: userId })
    .populate('user', '-password')
    .populate('comments')
    .sort('-createdAt')

  res.json(userStories)
})

const getReadingHistory = expressAsyncHandler(async (req, res) => {
  const reads = await Read.find({ user: req.user?._id })
    .populate('story')
    .sort('-createdAt')

  res.json(reads)
})

module.exports = {
  getReadingHistory,
  getMyClappedStories,
  getMyViewedStories,
  getMyReadStories,
  getView,
  createStory,
  editStory,
  deleteStory,
  getStories,
  getRecommendedStories,
  getTrendingStories,
  getStory,
  addClap,
  removeUsersClaps,
  getClapsOnStory,
  getAllTags,
  markStoryRead,
  markStoryViewed,
  getUserStories,
}

 
 