const expressAsyncHandler = require('express-async-handler')
const Story = require('../models/Story')
const List = require('../models/List')
const User = require('../models/User')

const mongoose = require('mongoose')

const getList = expressAsyncHandler(async (req, res) => {
  console.log('In getList controller ')

  const { id: listId } = req?.params
  const list = await List.findById(listId)
    .populate('stories')
    .populate('user', '-password')

  res.json(list)
})

const getMyLists = expressAsyncHandler(async (req, res) => {
  const { id: userId } = req?.user

  const lists = await List.find({ user: userId })
    .populate('stories')
    .populate('user', '-password')

  res.json(lists)
})

const getUserLists = expressAsyncHandler(async (req, res) => {
  console.log('In getUserLists')
  const { id: userId } = req?.params

  const lists = await List.find({ user: userId })
    .populate('stories')
    .populate('user', '-password')

  res.json(lists)
})

const createList = expressAsyncHandler(async (req, res) => {
  console.log('In createList ')
  const { _id: loggedInUserId } = req?.user

  const { name, description, isPrivate } = req?.body

  const list = await List.create({
    name,
    description,
    isPrivate,
    user: loggedInUserId,
  })

  res.status(201).json(list)
})

const addStoryToLists = expressAsyncHandler(async (req, res) => {
  console.log('Inside addStoryToLists')
  const { storyId, listChoices } = req.body

  const userSelectedLists = await List.find({ _id: { $in: listChoices } })

  userSelectedLists.forEach(async (list) => {
    const storyExists = list.stories.includes(storyId)

    if (storyExists) {
      res.status(422)
      throw new Error('Story already exists in list!')
    } else {
      let myList = await List.findById(list)
      myList.stories.push(storyId)
      await myList.save()
    }
  })

  res.json(userSelectedLists)
})

const editList = expressAsyncHandler(async (req, res) => {
  console.log('Inside editList')

  const { id: listId } = req?.params

  const { name, description, isPrivate } = req?.body

  const list = await List.findById(listId.toString())

  if (!list) {
    res.status(404)
    throw new Error('List not found.')
  } else {
    //handle error if no list found
    list.name = name || list.name
    list.description = description || list.description
    list.isPrivate = isPrivate || list.isPrivate

    await list.save()

    res.json(list)
  }
})

const removeStoryFromList = expressAsyncHandler(async (req, res) => {
  console.log('In removeStoryFromList')
  const { id: listId } = req?.params
  const { storyId } = req?.body

  const list = await List.findById(listId)

  const storyToRemove = await Story.findById(storyId)

  if (!list || !storyToRemove) {
    res.status(404)
    throw new Error('Either story or list not found.')
  } else {
    await List.findByIdAndUpdate(
      listId,
      {
        $pull: { stories: storyId },
      },
      { new: true }
    )

    res.json(storyToRemove)
  }
})

const removeMyList = expressAsyncHandler(async (req, res) => {
  console.log('Inside removeMyList')
  const { id: listId } = req?.params
  const { _id: userId } = req.user

  const list = await List.findById(listId)

  if (!list) {
    res.status(404)
    throw new Error('List not found.')
  }
  if (list.user._id.toString() !== userId.toString()) {
    res.status(422)
    throw new Error('You must be owner of this list to remove it.')
  } else {
    await list.remove()

    res.json(list)
  }
})

const saveUserList = expressAsyncHandler(async (req, res) => {
  console.log('In saveUserList')

  const { id: listId } = req.params
  const { _id: userId } = req?.user

  const list = await List.findById(listId)
  const user = await User.findById(userId)

  if (list.user.toString() === userId.toString()) {
    res.status(422)
    throw new Error('Can not save your own list')
  } else if (user.savedReadingLists.includes(listId.toString())) {
    res.status(422)
    throw new Error('You have already saved this list.')
  } else {
    user.savedReadingLists.push(listId)
    await user.save()
    res.json(user)
  }
})

const removeSavedList = expressAsyncHandler(async (req, res) => {
  console.log('In removeSavedList')

  const { id: listId } = req.params
  const { _id: userId } = req?.user

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { savedReadingLists: listId },
    },
    {
      new: true,
    }
  )

  res.json(user)
})

const getSavedLists = expressAsyncHandler(async (req, res) => {
  console.log('In getSavedLists')
  const { _id: userId } = req.user

  const user = await User.findById(userId)

  const lists = await List.find({ _id: { $in: user.savedReadingLists } })
    .populate('stories')
    .populate('user', '-password')

  res.json(lists)
})

module.exports = {
  createList,

  addStoryToLists,
  getList,
  editList,
  removeMyList,
  removeStoryFromList,
  getMyLists,
  getUserLists,
  saveUserList,
  getSavedLists,
  removeSavedList,
}

 