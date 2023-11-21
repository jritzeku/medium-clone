// @ts-nocheck

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../../utils/baseURL'

export const getNotificationsAction = createAsyncThunk(
  'notification/getNotifications',

  async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/notification/${userId}`,
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

export const markNotificationReadAction = createAsyncThunk(
  'notification/markNotificationRead',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/notification/markNotificationRead/${id}`,
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

export const markAllNotificationsReadAction = createAsyncThunk(
  'notification/markAllNotificationsRead',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
        //   'Content-Type': 'multipart/form-data',
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/notification/markAllNotificationsRead`,

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

const initialState = {
  newNotification: {},
  notifications: [],
}

const notificationSlices = createSlice({
  name: 'notification',

  initialState,
  reducers: {
    setNewNotification: (state, action) => {
      state.newNotification = action?.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getNotificationsAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getNotificationsAction.fulfilled, (state, action) => {
      state.notifications = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getNotificationsAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(markNotificationReadAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(markNotificationReadAction.fulfilled, (state, action) => {
      state.notificationRead = action?.payload

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(markNotificationReadAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    builder.addCase(markAllNotificationsReadAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(
      markAllNotificationsReadAction.fulfilled,
      (state, action) => {
        /*
      -set as 'state.notifications' instead ??
        ->this way, our components would contain updated data next time the caching cycle ends... 

      */

        state.allNotificationsRead = action?.payload

        state.loading = false

        state.appErr = undefined

        state.serverErr = undefined
      }
    )

    builder.addCase(
      markAllNotificationsReadAction.rejected,
      (state, action) => {
        state.loading = false

        state.appErr = action?.payload?.message

        state.serverErr = action?.error?.message
      }
    )
  },
})

export const { setNewNotification } = notificationSlices.actions

export default notificationSlices.reducer
