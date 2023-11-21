const express = require('express')

const {
  getMyViewedStories,
  getMyReadStories,
  getMyClappedStories,
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
  getView,
  getUserStories,
  getReadingHistory,
} = require('../controllers/storyController')

const { authMw, adminMw } = require('../middlewares/userMw')

const { imgUploadMw, storyImgResizeMw } = require('../middlewares/uploadMw')

const storyRoutes = express.Router()
 

storyRoutes.get('/', getStories)
storyRoutes.get('/recommendedStories/:topic', authMw, getRecommendedStories)
storyRoutes.get('/allTags', getAllTags)
storyRoutes.get('/readingHistory', authMw, getReadingHistory)
storyRoutes.get('/getUserStories/:id', getUserStories)

storyRoutes.get(
  '/getTrendingStories',
 
  getTrendingStories
)
storyRoutes.get('/getMyViewedStories/:date?', authMw, getMyViewedStories)
storyRoutes.get('/getMyReadStories/:date?', authMw, getMyReadStories)
storyRoutes.get('/getMyClappedStories/:date?', authMw, getMyClappedStories)
storyRoutes.get('/:id', getStory) //getClapsOnStory

storyRoutes.get(
  '/readingHistory',
  authMw,
 
  getReadingHistory
)
storyRoutes.get('/:id/storyClaps', getClapsOnStory) //getClapsOnStory
storyRoutes.get('/getView/:id', authMw, getView)

storyRoutes.delete('/:id', authMw, deleteStory)
storyRoutes.put('/:id/addClap', authMw, addClap)
storyRoutes.delete('/:id/removeUsersClaps', authMw, removeUsersClaps)
storyRoutes.put('/:id/markStoryViewed', authMw, markStoryViewed)
storyRoutes.put('/:id/markStoryRead', authMw, markStoryRead)

storyRoutes.post(
  '/',
  authMw,
  imgUploadMw.single('image'),
  storyImgResizeMw,
  createStory
)

storyRoutes.put(
  '/:id',
  authMw,
  imgUploadMw.single('image'),
  storyImgResizeMw,
  editStory
)

module.exports = storyRoutes

/*
NOTES:

-You can NOT send objects for GET requests  because req.body is ONLY for PUT and POST requests
  ->i used req.params instead 
https://stackoverflow.com/questions/55876311/how-to-pass-an-object-to-a-get-request


-Making req.params optional 
https://javasper.hashnode.dev/how-to-create-an-optional-parameter-in-express
*/
