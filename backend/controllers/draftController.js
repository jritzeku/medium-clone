const expressAsyncHandler = require('express-async-handler')
const Draft = require('../models/Draft')
const cloudinaryUploadImg = require('../utils/cloudinaryUpload')
const validateId = require('../utils/validateId')

const saveDraft = expressAsyncHandler(async (req, res) => {
  console.log('Inside saveDraft ')
  const { _id: loggedInUserId } = req?.user

  const { title, content, tags } = req?.body

  if (typeof tags === 'string') {
    tagsArray = tags.split(',')
  } else {
    tagsArray = tags
  }

  //get path to img
  const localPath = `public/images/posts/${req?.file.filename}`

  const imgUploaded = await cloudinaryUploadImg(localPath)

  const draft = await Draft.create({
    title,
    content,
    tags: tagsArray, //NOTE: in the case we don't add tags, it wnt crash our program
    thumbnailImg: imgUploaded?.url,
    user: loggedInUserId,
  })

  res.status(201).json(draft)
})

const editDraft = expressAsyncHandler(async (req, res) => {
  console.log('Inside editDraft  ')
  const { _id: loggedInUserId } = req?.user
  const { id: draftId } = req?.params

 
  const { title, content, tags } = req?.body

  let tagsArray

  if (typeof tags === 'string') {
    tagsArray = tags.split(',')
  } else {
    tagsArray = tags
  }

  const draft = await Draft.findById(draftId)

  if (!(draft.user.toString() === loggedInUserId.toString())) {
    res.status(422)
    throw new Error('Not allowed, you are not the owner of this content.')
  }

  if (!draft) {
    res.status(404)
    throw new Error('draft not found.')
  }

  draft.title = title || draft.title
  draft.content = content || draft.content
  draft.tags = tags || draft.tags

  await draft.save()

  res.json(draft)
})

const getDrafts = expressAsyncHandler(async (req, res) => {
  console.log('Inside getDrafts  ')
  const { _id: loggedInUserId } = req?.user

  let drafts = await Draft.find({ user: loggedInUserId })

  res.json(drafts)
})

const getDraft = expressAsyncHandler(async (req, res) => {
  console.log('Inside getDraft  ')
  const { _id: loggedInUserId } = req?.user
  const { id: draftId } = req.params

  let draft = await Draft.findById(draftId)

  if (!(draft?.user?.toString() === loggedInUserId.toString())) {
    res.status(422)
    throw new Error('Not allowed, you are not the owner of this content.')
  }

  if (!draft) {
    res.status(404)
    throw new Error('draft not found.')
  }

  res.json(draft)
})

const deleteDraft = expressAsyncHandler(async (req, res) => {
  const { id } = req.params

  const draft = await Draft.findById(id)

  if (!draft) {
    res.status(404)
    throw new Error('draft not found.')
  }

  await draft.remove()

  res.json(draft)
})

module.exports = {
  saveDraft,
  editDraft,
  getDrafts,
  getDraft,
  deleteDraft,
}
