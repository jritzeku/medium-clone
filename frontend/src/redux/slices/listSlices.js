// @ts-nocheck
 
import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../../utils/baseURL'


const resetListAction = createAction('list/reset')

export const getMyListsAction = createAsyncThunk(
  'list/getMyLists',
  
  async (id, { rejectWithValue, getState, dispatch }) => {
    
    const user = getState()?.user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.get(`${baseUrl}/api/list/getMyLists`, config)

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)


//TOD
export const getSavedListsAction = createAsyncThunk(
  'list/getSavedLists',
  
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
        `${baseUrl}/api/list/getSavedLists`,
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

export const getUserListsAction = createAsyncThunk(
  'list/getUserLists',
  
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/list/getUserLists/${id}`)

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const createListAction = createAsyncThunk(
  'list/createList',
  
  
  async (list, { rejectWithValue, getState, dispatch }) => {
    
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.post(
        `${baseUrl}/api/list`,

        {
          
          name: list?.name,
          
          description: list?.description,
          
          isPrivate: list?.isPrivate,
        },
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

export const getListAction = createAsyncThunk(
  'list/getList',
  
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/list/getList/${id}`)

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const getSavedListAction = createAsyncThunk(
  'list/getSavedList',
  
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/list/getList/${id}`)

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

export const addStoryToListsAction = createAsyncThunk(
  'list/addStoryToListsAction',
  
  async (payload, { rejectWithValue, getState, dispatch }) => {
    
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    
    // const { userId, values } = payload

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/list/addStoryToLists`,
        {
          
          storyId: payload.storyId,
          
          listChoices: [...payload.values.listChoices],
        },
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

export const saveUserListAction = createAsyncThunk(
  'list/saveUserList',
  
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
        `${baseUrl}/api/list/saveUserList/${id}`,
        {},
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

export const editListAction = createAsyncThunk(
  'list/editList',
  
  async ([id, listData], { rejectWithValue, getState, dispatch }) => {
    
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/list/editList/${id}`,
        listData,
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

export const removeStoryFromListAction = createAsyncThunk(
  'list/removeStoryFromList',
  
  async ([listId, storyId], { rejectWithValue, getState, dispatch }) => {
    
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/list/removeStoryFromList/${listId}`,
        { storyId: storyId }, //MAY need this or get error.
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

export const removeMyListAction = createAsyncThunk(
  'list/removeList',
  
  async (id, { rejectWithValue, getState, dispatch }) => {
    
    const user = getState().user
    const { userAuth } = user
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    }

    try {
      const { data } = await axios.delete(
        `${baseUrl}/api/list/removeMyList/${id}`,
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

export const removeSavedListAction = createAsyncThunk(
  'list/removeSavedList',
  
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
        `${baseUrl}/api/list/removeSavedList/${id}`,
        {},
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


const listSlices = createSlice({
  name: 'list',
  initialState: {},
  extraReducers: (builder) => {
    
    
    builder.addCase(getMyListsAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(getMyListsAction.fulfilled, (state, action) => {
      
      state.myLists = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(getMyListsAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    
    builder.addCase(getSavedListsAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(getSavedListsAction.fulfilled, (state, action) => {
      
      state.savedLists = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(getSavedListsAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(getListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(getListAction.fulfilled, (state, action) => {
      
      state.list = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(getListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(getSavedListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(getSavedListAction.fulfilled, (state, action) => {
      
      state.savedList = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(getSavedListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(getUserListsAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(getUserListsAction.fulfilled, (state, action) => {
      
      state.userLists = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(getUserListsAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    
    builder.addCase(createListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(createListAction.fulfilled, (state, action) => {
      
      state.listCreated = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(createListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(editListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(editListAction.fulfilled, (state, action) => {
      
      state.listEdited = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(editListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(addStoryToListsAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(addStoryToListsAction.fulfilled, (state, action) => {
      
      state.storyAddedToList = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(addStoryToListsAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(saveUserListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(saveUserListAction.fulfilled, (state, action) => {
      
      state.listSaved = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(saveUserListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(removeStoryFromListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(removeStoryFromListAction.fulfilled, (state, action) => {
      
      state.storyRemovedFromList = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(removeStoryFromListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(removeMyListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(removeMyListAction.fulfilled, (state, action) => {
      
      state.myListRemoved = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(removeMyListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })

    
    builder.addCase(removeSavedListAction.pending, (state, action) => {
      
      state.loading = true
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })

    
    builder.addCase(removeSavedListAction.fulfilled, (state, action) => {
      
      state.savedListRemoved = action.payload
      
      state.loading = false
      
      state.appErr = undefined
      
      state.serverErr = undefined
    })
    
    builder.addCase(removeSavedListAction.rejected, (state, action) => {
      
      state.loading = false
      
      state.appErr = action.payload.message
      
      state.serverErr = action.error.message
    })
  },
})

export default listSlices.reducer

/*
NOTES: 

 

*/
