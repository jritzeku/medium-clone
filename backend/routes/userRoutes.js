const express = require('express')

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,

  editProfile,
  followUser,
  unfollowUser,
 
  editUserAdmin,
  deleteUser,
  addTagToRecommendations,
  removeTagFromRecommendations,
} = require('../controllers/userController')

const { authMw, adminMw } = require('../middlewares/userMw')
const {
imgUploadMw,
  profileImgResizeMw,
  storyImgResizeMw,
} = require('../middlewares/uploadMw')
 

const userRoutes = express.Router()

userRoutes.post('/', registerUser)
userRoutes.post('/login', loginUser)

userRoutes.get('/', authMw, getAllUsers)
userRoutes.get('/:id', getUser)

userRoutes.put('/addTagToRecommendations', authMw, addTagToRecommendations)

userRoutes.put(
  '/removeTagFromRecommendations',
  authMw,
  removeTagFromRecommendations
)

 

userRoutes.put(
  '/:id',
  authMw,
  imgUploadMw.single('image'),
  profileImgResizeMw,
  editProfile
)


userRoutes.put('/follow/:id', authMw, followUser)
userRoutes.put('/unfollow/:id', authMw, unfollowUser)
 
userRoutes.put('/editUser/:id', authMw, adminMw, editUserAdmin)
userRoutes.delete('/deleteUser/:id', authMw, adminMw, deleteUser)

module.exports = userRoutes
 