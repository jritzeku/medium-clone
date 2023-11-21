const express = require('express')

const {
  saveDraft,
  editDraft, 
  getDrafts,
  getDraft,
  deleteDraft,
} = require('../controllers/draftController')

const { authMw, adminMw } = require('../middlewares/userMw')

const { imgUploadMw, storyImgResizeMw } = require('../middlewares/uploadMw')

const draftRoutes = express.Router()

draftRoutes.post(
  '/',
  authMw,
  imgUploadMw.single('image'),
  storyImgResizeMw,
  saveDraft
)
 
draftRoutes.get('/:id', authMw, getDraft)

draftRoutes.get('/', authMw, getDrafts)
 

draftRoutes.put('/:id', authMw, editDraft)
draftRoutes.delete('/:id', authMw, deleteDraft)

module.exports = draftRoutes
