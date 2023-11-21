const express = require('express')

const {
  createComment,
  editComment,
  deleteComment,
  getAllComments,
  getComment,
  getStoryComments,
} = require('../controllers/commentController')

const { authMw, adminMw } = require('../middlewares/userMw')
const commentRoutes = express.Router()

commentRoutes.post('/:id', authMw, createComment)

commentRoutes.get('/', getAllComments)
commentRoutes.get('/storyComments/:id', getStoryComments)
commentRoutes.get('/:id', getComment)

commentRoutes.put('/:id', authMw, editComment)
commentRoutes.delete('/:id', authMw, deleteComment)  

module.exports = commentRoutes
