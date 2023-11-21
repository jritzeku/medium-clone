const express = require('express')

const {
  createList,
  getList,
  getMyLists,
  getUserLists,

  addStoryToLists,
  editList,
  removeMyList,
  removeStoryFromList,
  saveUserList,
  getSavedLists,

  removeSavedList,
} = require('../controllers/listController')

const { authMw, adminMw } = require('../middlewares/userMw')

const listRoutes = express.Router()

listRoutes.post('/', authMw, createList)

listRoutes.put('/editList/:id', authMw, editList)
listRoutes.get('/getMyLists', authMw, getMyLists) 
listRoutes.get('/getSavedLists', authMw, getSavedLists)
listRoutes.get('/getUserLists/:id', getUserLists)
listRoutes.get('/getList/:id', getList)

listRoutes.put('/addStoryToLists', authMw, addStoryToLists)
listRoutes.put('/removeStoryFromList/:id', authMw, removeStoryFromList)
listRoutes.put('/saveUserList/:id', authMw, saveUserList)
listRoutes.put('/removeSavedList/:id', authMw, removeSavedList)

listRoutes.delete('/removeMyList/:id', authMw, removeMyList)

module.exports = listRoutes
