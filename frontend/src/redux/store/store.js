import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slices/userSlices'
import story from '../slices/storySlices'
import comment from '../slices/commentSlices'

import list from '../slices/listSlices'
import draft from '../slices/draftSlices'
import notification from '../slices/notificationSlices'
const store = configureStore({
  reducer: {
    user: userReducer,
    comment,
    story,
    list,

    draft,
    notification,
  },
})

export default store
