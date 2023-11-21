// @ts-nocheck

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../../utils/baseURL'

export const createDraftAction = createAsyncThunk(
  'story/createDraft',

  async (draft, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const formData = new FormData()

      formData.append('title', draft?.title)

      formData.append('content', draft?.content)

      formData.append('tags', draft?.tags)

      formData.append('image', draft?.image)

      let formDataObj = Object.fromEntries([...formData.entries()])
  

      const { data } = await axios.post(
        `${baseUrl}/api/draft`,
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

export const editDraftAction = createAsyncThunk(
  'stories/editDraft',

  async ([id, editDraft], { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/draft/${id}`,
        editDraft,
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
export const deleteDraftAction = createAsyncThunk(
  'story/deleteDraft',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.delete(`${baseUrl}/api/draft/${id}`, config)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getDraftsAction = createAsyncThunk(
  'story/getDrafts',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
        'Content-Type': 'multipart/form-data',
      },
    }

    try {
      const { data } = await axios.get(`${baseUrl}/api/draft`, config)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getDraftAction = createAsyncThunk(
  'story/getDraft',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
        'Content-Type': 'multipart/form-data',
      },
    }

    try {
      const { data } = await axios.get(`${baseUrl}/api/draft/${id}`, config)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

const draftSlices = createSlice({
  name: 'draft',
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(createDraftAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(createDraftAction.fulfilled, (state, action) => {
      state.draftCreated = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(createDraftAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(editDraftAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(editDraftAction.fulfilled, (state, action) => {
      state.draftEdited = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(editDraftAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(getDraftsAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getDraftsAction.fulfilled, (state, action) => {
      state.drafts = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getDraftsAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(getDraftAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getDraftAction.fulfilled, (state, action) => {
      state.draft = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getDraftAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(deleteDraftAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(deleteDraftAction.fulfilled, (state, action) => {
      state.draftDeleted = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(deleteDraftAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })
  },
})

export default draftSlices.reducer
