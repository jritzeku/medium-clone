// @ts-nocheck

import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../../utils/baseURL'

const resetUserAction = createAction('user/profile/reset')

export const registerUserAction = createAsyncThunk(
  'user/register', //this has NOTHING to do with our routes in backend..

  async (user, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const { data } = await axios.post(`${baseUrl}/api/user`, user, config)

      //upon successful register, set user data in LS
      localStorage.setItem('userInfo', JSON.stringify(data))

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const loginUserAction = createAsyncThunk(
  'user/login',

  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const { data } = await axios.post(
        `${baseUrl}/api/user/login`,
        userData,
        config
      )

      //upon successful login, set user data in LS
      localStorage.setItem('userInfo', JSON.stringify(data))

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const logoutAction = createAsyncThunk(
  '/user/logout',

  async (rejectWithValue, getState, dispatch) => {
    try {
      localStorage.removeItem('userInfo')
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const userProfileAction = createAsyncThunk(
  'user/profile',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(`${baseUrl}/api/user/${id}`, config)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const editUserAction = createAsyncThunk(
  'user/editProfile',

  async ([id, editedData], { rejectWithValue, getState, dispatch }) => {
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }
 

    try {
      const formData = new FormData()

      formData.append('firstName', editedData?.firstName)

      formData.append('lastName', editedData?.lastName)

      formData.append('blurb', editedData?.blurb)

      formData.append('aboutMe', editedData?.aboutMe)
      //@ts-ignore
      formData.append('image', editedData?.image)

      const { data } = await axios.put(
        `${baseUrl}/api/user/${id}`,

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

export const getLoggedInUserAction = createAsyncThunk(
  'user/getLoggedInUser',

  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/user/${id}`)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const getUserAction = createAsyncThunk(
  'user/getUser',

  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/user/${id}`)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const getAllUsersAction = createAsyncThunk(
  'user/getAllUsers',

  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(`${baseUrl}/api/user`, config)

      return data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const followUserAction = createAsyncThunk(
  'user/followUser',

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
        `${baseUrl}/api/user/follow/${id}`,

        {},
        config
      )
      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const unfollowUserAction = createAsyncThunk(
  'user/unfollowUser',

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
        `${baseUrl}/api/user/unfollow/${id}`,
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

export const checkIfFollowingAction = createAsyncThunk(
  'user/checkIfFollowing',

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
        `${baseUrl}/api/user/checkIfFollowing/${id}`,
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

export const blockUserAction = createAsyncThunk(
  'user/blockUser',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/user/blockUser/${id}`,
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

export const unblockUserAction = createAsyncThunk(
  'user/unblockUser',

  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/user/unblockUser/${id}`,
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

export const addTagToRecommendationsAction = createAsyncThunk(
  'user/addTagToRecommendations',

  async (tag, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/user/addTagToRecommendations`,
        tag,
        config
      )
      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const removeTagFromRecommendationsAction = createAsyncThunk(
  'user/removeTagFromRecommendations',

  async (tag, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/user/removeTagFromRecommendations`,
        tag,
        config
      )
      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
const loggedInUser = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

// @ts-ignore
const userSlices = createSlice({
  name: 'user',
  initialState: {
    userAuth: loggedInUser,
  },

  extraReducers: (builder) => {
    //Register

    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.userRegistered = action.payload
      state.userAuth = action?.payload

      state.loading = false

      state.appErr = false

      state.serverErr = false
    })

    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action.payload.message

      state.serverErr = action.payload.message
    })

    //Login

    builder.addCase(loginUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload

      state.loading = false

      state.appErr = false

      state.serverErr = false
    })

    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload.message

      state.serverErr = action?.payload.message
    })

    //Logout

    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = false
    })

    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.userAuth = undefined

      state.userDetails = undefined

      state.loading = false

      state.appErr = undefined

      state.serverErr = undefined
    })
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message

      state.loading = false
    })

    //Get user

    builder.addCase(getLoggedInUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getLoggedInUserAction.fulfilled, (state, action) => {
      state.loggedInUserDetails = action?.payload

      // state.isEdited = false

      state.loading = false

      state.appErr = false

      state.serverErr = false
    })

    builder.addCase(getLoggedInUserAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.payload?.message
    })

    //Get user

    builder.addCase(getUserAction.pending, (state, action) => {
      state.loadingUser = true

      state.appErrUser = undefined

      state.serverErrUser = undefined
    })

    builder.addCase(getUserAction.fulfilled, (state, action) => {
      state.userDetails = action?.payload

      // state.isEdited = false

      state.loadingUser = false

      state.appErrUser = false

      state.serverErrUser = false
    })

    builder.addCase(getUserAction.rejected, (state, action) => {
      state.loadingUser = false

      state.appErrUser = action?.payload?.message

      state.serverErrUser = action?.payload?.message
    })

    //Block user

    builder.addCase(blockUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(blockUserAction.fulfilled, (state, action) => {
      state.userBlocked = action.payload

      state.loading = false

      state.appErr = false

      state.serverErr = false
    })

    builder.addCase(blockUserAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.payload?.message
    })

    //Unblock user

    builder.addCase(unblockUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(unblockUserAction.fulfilled, (state, action) => {
      state.userUnblocked = action.payload

      state.loading = false

      state.appErr = false

      state.serverErr = false
    })

    builder.addCase(unblockUserAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.payload?.message
    })

    //Get all users

    builder.addCase(getAllUsersAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(getAllUsersAction.fulfilled, (state, action) => {
      state.allUsers = action.payload

      state.loading = false

      state.appErr = false

      state.serverErr = false
    })

    builder.addCase(getAllUsersAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.payload?.message
    })

    //Mark story read

    //user Follow

    builder.addCase(followUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })
    builder.addCase(followUserAction.fulfilled, (state, action) => {
      state.loading = false

      state.followed = action?.payload

      state.unFollowed = undefined

      state.appErr = undefined

      state.serverErr = undefined
    })
    builder.addCase(followUserAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.unFollowed = undefined //why???

      state.serverErr = action?.error?.message
    })

    //user unFollow

    builder.addCase(unfollowUserAction.pending, (state, action) => {
      state.unfollowLoading = true

      state.appErr = undefined

      state.serverErr = undefined
    })
    builder.addCase(unfollowUserAction.fulfilled, (state, action) => {
      state.unfollowLoading = false

      state.unFollowed = action?.payload

      state.followed = undefined

      state.appErr = undefined

      state.appErr = undefined
    })
    builder.addCase(unfollowUserAction.rejected, (state, action) => {
      state.unfollowLoading = false

      state.unFollowedAppErr = action?.payload?.message

      state.unfollowServerErr = action?.error?.message
    })

    //Update user

    builder.addCase(editUserAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })

    builder.addCase(resetUserAction, (state, action) => {
      state.isEdited = true
    })
    builder.addCase(editUserAction.fulfilled, (state, action) => {
      state.loading = false

      state.userEdited = action?.payload

      //   state.isEdited = false

      state.appErr = undefined

      state.serverErr = undefined
    })
    builder.addCase(editUserAction.rejected, (state, action) => {
    

      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    //Add tag to recommendations

    builder.addCase(addTagToRecommendationsAction.pending, (state, action) => {
      state.loading = true

      state.appErr = undefined

      state.serverErr = undefined
    })
    builder.addCase(
      addTagToRecommendationsAction.fulfilled,
      (state, action) => {
        state.loading = false

        state.tagAddedToRecommendations = action?.payload

        state.appErr = undefined

        state.serverErr = undefined
      }
    )
    builder.addCase(addTagToRecommendationsAction.rejected, (state, action) => {
      state.loading = false

      state.appErr = action?.payload?.message

      state.serverErr = action?.error?.message
    })

    //Remove tag from recommendations
    builder.addCase(
      removeTagFromRecommendationsAction.pending,

      (state, action) => {
        state.loading = true

        state.appErr = undefined

        state.serverErr = undefined
      }
    )
    builder.addCase(
      removeTagFromRecommendationsAction.fulfilled,
      (state, action) => {
        state.loading = false

        state.tagRemovedFromRecommendations = action?.payload

        state.appErr = undefined

        state.serverErr = undefined
      }
    )
    builder.addCase(
      removeTagFromRecommendationsAction.rejected,
      (state, action) => {
        state.loading = false

        state.appErr = action?.payload?.message

        state.serverErr = action?.error?.message
      }
    )
  },
})

export default userSlices.reducer
