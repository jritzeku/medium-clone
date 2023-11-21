// @ts-nocheck
 
import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../../utils/baseURL'

const resetCommentAction = createAction('comment/reset')

export const addCommentAction = createAsyncThunk(
  'comment/addComment',
  async ([comment, id], { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.post(
        `${baseUrl}/api/comment/${id}`,
        { content: comment?.content },
        config
      )

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const editCommentAction = createAsyncThunk(
  'comment/editComment',
  async ([id, content], { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/comment/${id}`,
        content,
        config
      )

      dispatch(resetCommentAction())
      //dispatch(editNotificationAction(id))

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const deleteCommentAction = createAsyncThunk(
  'comment/deleteComment',
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.delete(
        `${baseUrl}/api/comment/${id}`,

        config
      )

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const getCommentAction = createAsyncThunk(
  'comment/getComment',
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/comment/${id}`)

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const getStoryCommentsAction = createAsyncThunk(
  'comment/getStoryComments',
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/comment/storyComments/${id}`
      )

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

// @ts-ignore
const commentSlices = createSlice({
  name: 'comment',
  initialState: {},
  extraReducers: (builder) => {
    //Create comment

    builder.addCase(addCommentAction.pending, (state, action) => {
      state.loading = true
      state.appErr = undefined
      state.serverErr = undefined
    })

    builder.addCase(addCommentAction.fulfilled, (state, action) => {
      state.commentAdded = action.payload
      state.loading = false
      state.appErr = undefined
      state.serverErr = undefined
    })
    builder.addCase(addCommentAction.rejected, (state, action) => {
      state.loading = false
      state.appErr = action?.payload?.message
      state.serverErr = action?.error?.message
    })

    //Edit comment

    builder.addCase(editCommentAction.pending, (state, action) => {
      state.loading = true
      state.appErr = undefined
      state.serverErr = undefined
    })

    builder.addCase(editCommentAction.fulfilled, (state, action) => {
      state.commentEdited = action.payload
      state.loading = false
      state.appErr = undefined
      state.serverErr = undefined
    })
    builder.addCase(editCommentAction.rejected, (state, action) => {
      state.loading = false
      state.appErr = action.payload.message
      state.serverErr = action.error.message
    })

    //Delete comment

    builder.addCase(deleteCommentAction.pending, (state, action) => {
      state.loading = true
      state.appErr = undefined
      state.serverErr = undefined
    })

    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.commentDeleted = action.payload
      state.loading = false
      state.appErr = undefined
      state.serverErr = undefined
    })
    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.loading = false
      state.appErr = action.payload.message
      state.serverErr = action.error.message
    })

    //Get comment
    builder.addCase(getCommentAction.pending, (state, action) => {
      state.loading = true
      state.appErr = undefined
      state.serverErr = undefined
    })

    builder.addCase(getCommentAction.fulfilled, (state, action) => {
      state.commentDetails = action.payload
      state.loading = false
      state.appErr = undefined
      state.serverErr = undefined
    })
    builder.addCase(getCommentAction.rejected, (state, action) => {
      state.loading = false
      state.appErr = action.payload.message
      state.serverErr = action.error.message
    })

    //Get story comments
    builder.addCase(getStoryCommentsAction.pending, (state, action) => {
      state.loading = true
      state.appErr = undefined
      state.serverErr = undefined
    })

    builder.addCase(getStoryCommentsAction.fulfilled, (state, action) => {
      state.storyComments = action.payload
      state.loading = false
      state.appErr = undefined
      state.serverErr = undefined
    })
    builder.addCase(getStoryCommentsAction.rejected, (state, action) => {
      state.loading = false
      state.appErr = action.payload.message
      state.serverErr = action.error.message
    })
  },
})

export default commentSlices.reducer
