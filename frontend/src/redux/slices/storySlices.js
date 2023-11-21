// @ts-nocheck

import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../../utils/baseURL'

const resetStoryEdit = createAction('story/reset')
const resetStoryDelete = createAction('story/delete')

const setTags = createAction('story/setTags')

export const createStoryAction = createAsyncThunk(
  'story/createStory',

  async (story, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
        'Content-Type': 'multipart/form-data',
      },
    }

    try {
      const formData = new FormData()

      formData.append('title', story?.title)

      formData.append('content', story?.content)

      formData.append('tags', story?.tags)

      formData.append('image', story?.image)

      if (story?.draftId) {
        formData.append('draftId', story?.draftId)
      }

      const { data } = await axios.post(
        `${baseUrl}/api/story`,

        formData,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const editStoryAction = createAsyncThunk(
  'stories/editStory',

  async ([id, editedData], { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

 

    try {
 
      const formData = new FormData()

      formData.append('title', editedData?.title)

      formData.append('content', editedData?.content)

      formData.append('tags', editedData?.tags)

      formData.append('image', editedData?.image)

      let formDataObj = Object.fromEntries([...formData.entries()])
 

      const { data } = await axios.put(
        `${baseUrl}/api/story/${id}`,
        formData,

        config
      )

      dispatch(resetStoryEdit())
      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteStoryAction = createAsyncThunk(
  'story/deleteStory',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.delete(`${baseUrl}/api/story/${id}`, config)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getStoriesAction = createAsyncThunk(
  'story/getAllStories',

  async (keyword = '', { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story?keyword=${keyword}`
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getRecommendedStoriesAction = createAsyncThunk(
  'story/getRecommendedStories',

  async (topic = '', { rejectWithValue, getState, dispatch }) => {
    try {
      const user = getState()?.user
      const { userAuth } = user

      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.token}`,
        },
      }

      const { data } = await axios.get(
        `${baseUrl}/api/story/recommendedStories/${topic}`,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getTrendingStoriesAction = createAsyncThunk(
  'story/getTrendingStories',

  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/getTrendingStories`
      )
      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getAllTagsAction = createAsyncThunk(
  'story/getAllTags',

  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/story/allTags`)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getStoryAction = createAsyncThunk(
  'story/getStory',

  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/story/${id}`)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

/*
NOTE: may noy work...first time passing multiple args in our thunk function
  ->if this dont work, can just pass 'story' only
    -can pass story.id for endpoint
    -then just set story as additional object after config
*/

export const addClapAction = createAsyncThunk(
  'story/addClap',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/story/${id}/addClap`,
        {}, //TODO: REMEMBER THIS!! when no data passed on edit, we have to  pass empty obj!
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getStoryClapsAction = createAsyncThunk(
  'story/getStoryClaps',

  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/story/${id}/storyClaps`)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const removeUsersClapsAction = createAsyncThunk(
  'story/removeStoryClaps',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.delete(
        `${baseUrl}/api/story/${id}/removeUsersClaps`,

        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const markStoryViewedAction = createAsyncThunk(
  'story/markStoryViewed',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/story/${id}/markStoryViewed`,
        {},
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const markStoryReadAction = createAsyncThunk(
  'story/markStoryRead',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/story/${id}/markStoryRead`,
        {},
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getViewAction = createAsyncThunk(
  'story/getView',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/getView/${id}`,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getMyClappedStoriesAction = createAsyncThunk(
  'story/getMyClappedStories',

  async (date, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/getMyClappedStories/${date}`,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getMyViewedStoriesAction = createAsyncThunk(
  'story/getMyViewedStories',

  async (date, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/getMyViewedStories/${date}`,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getMyReadStoriesAction = createAsyncThunk(
  'story/getMyReadStories',

  async (date, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/getMyReadStories/${date}`,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getMyReadingHistoryAction = createAsyncThunk(
  'story/getMyReadingHistoryAction',

  async (date, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/readingHistory`,
        config
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getUserStoriesAction = createAsyncThunk(
  'story/getUserStories',

  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/story/getUserStories/${id}`
      )

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

const storySlices = createSlice({
  name: 'story',
  initialState: {},

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(markStoryViewedAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(markStoryViewedAction.fulfilled, (state, action) => {
      state.storyViewed = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(markStoryViewedAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(markStoryReadAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(markStoryReadAction.fulfilled, (state, action) => {
      state.storyRead = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(markStoryReadAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    //Create story

    builder.addCase(createStoryAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(createStoryAction.fulfilled, (state, action) => {
      state.storyCreated = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(createStoryAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    // builder.addCase(resetstory, (state, action) => {
    //   state.isCreated = true
    // })

    //Edit story

    builder.addCase(editStoryAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(editStoryAction.fulfilled, (state, action) => {
      state.storyEdited = action.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined

      state.isUpdated = false
    })

    builder.addCase(editStoryAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    builder.addCase(resetStoryEdit, (state, action) => {
      state.isUpdated = true
    })

    //Delete story

    builder.addCase(deleteStoryAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(deleteStoryAction.fulfilled, (state, action) => {
      state.storyDeleted = action.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined

      state.isUpdated = false
    })

    builder.addCase(deleteStoryAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    builder.addCase(resetStoryDelete, (state, action) => {
      state.isDeleted = true
    })

    //Get all storys

    builder.addCase(getStoriesAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getStoriesAction.fulfilled, (state, action) => {
      state.allStories = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getStoriesAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Get relevant stories

    builder.addCase(getRecommendedStoriesAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getRecommendedStoriesAction.fulfilled, (state, action) => {
      state.recommendedStories = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getRecommendedStoriesAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action.error.message
    })

    //Get my read stories

    builder.addCase(getMyReadStoriesAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyReadStoriesAction.fulfilled, (state, action) => {
      state.storiesRead = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyReadStoriesAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Get my viewd stories

    builder.addCase(getMyViewedStoriesAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyViewedStoriesAction.fulfilled, (state, action) => {
      state.storiesViewed = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyViewedStoriesAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Get my clapped stories

    builder.addCase(getMyClappedStoriesAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyClappedStoriesAction.fulfilled, (state, action) => {
      state.storiesClapped = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyClappedStoriesAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })
    //Reading history

    builder.addCase(getMyReadingHistoryAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyReadingHistoryAction.fulfilled, (state, action) => {
      state.readingHistory = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getMyReadingHistoryAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Get User Stories

    builder.addCase(getUserStoriesAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getUserStoriesAction.fulfilled, (state, action) => {
      state.userStories = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getUserStoriesAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Get Trending

    builder.addCase(getTrendingStoriesAction.pending, (state, action) => {
      state.loadingTrending = true

      state.appErrTrending = undefined

      state.serverErrTrending = undefined
    })

    builder.addCase(getTrendingStoriesAction.fulfilled, (state, action) => {
      state.trendingStories = action?.payload

      state.loadingTrending = false

      state.appErrTrending = undefined

      state.serverErrTrending = undefined
    })

    builder.addCase(getTrendingStoriesAction.rejected, (state, action) => {
      state.loadingTrending = false

      state.appErrTrending = action.payload.message

      state.serverErrTrending = action.error.message
    })

    builder.addCase(getAllTagsAction.pending, (state, action) => {
      state.loadingTags = true

      state.appErrTags = undefined

      state.serverErrTags = undefined
    })

    builder.addCase(getAllTagsAction.fulfilled, (state, action) => {
      state.allTags = action?.payload

      state.loadingTags = false

      state.appErrTags = undefined

      state.serverErrTags = undefined
    })

    builder.addCase(getAllTagsAction.rejected, (state, action) => {
      state.loadingTags = false

      state.appErrTags = action.payload.message

      state.serverErrTags = action.error.message
    })

    //Get story

    builder.addCase(getStoryAction.pending, (state, action) => {
      state.loadingStory = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getStoryAction.fulfilled, (state, action) => {
      state.storyDetails = action.payload

      state.loadingStory = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getStoryAction.rejected, (state, action) => {
      state.loadingStory = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Set clap  // TODO: may need to put in separate slice??

    builder.addCase(addClapAction.pending, (state, action) => {
      state.loadingAddClap = true

      state.appErrClap = undefined

      state.serverErrClap = undefined
    })

    builder.addCase(addClapAction.fulfilled, (state, action) => {
      state.storyClapped = action?.payload

      state.loadingAddClap = false

      state.appErrClap = undefined

      state.serverErrClap = undefined
    })

    builder.addCase(addClapAction.rejected, (state, action) => {
      state.loadingAddClap = false

      state.appErrClap = action.payload.message

      state.serverErrClap = action.error.message
    })

    //Get claps on story

    builder.addCase(getStoryClapsAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getStoryClapsAction.fulfilled, (state, action) => {
      state.storyClaps = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getStoryClapsAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    //Remove users claps on story

    builder.addCase(removeUsersClapsAction.pending, (state, action) => {
      state.loadingRemoveClap = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(removeUsersClapsAction.fulfilled, (state, action) => {
      state.usersClapsRemoved = action?.payload

      state.loadingRemoveClap = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(removeUsersClapsAction.rejected, (state, action) => {
      state.loadingRemoveClap = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })

    builder.addCase(getViewAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getViewAction.fulfilled, (state, action) => {
      state.viewDetail = action.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getViewAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.error.message
    })
  },
})

export default storySlices.reducer
