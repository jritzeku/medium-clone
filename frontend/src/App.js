// @ts-nocheck

import Navbar from 'components/navigation/Navbar'
import PrivateRoute from 'components/navigation/protectedRoutes/PrivateRoute'

import HomePage from 'pages/homepage/HomePage'
import Library from 'pages/library/Library'
import Profile from 'pages/profile/Profile'
import NewStory from 'pages/stories/NewStory'
import StoryDetails from 'pages/stories/StoryDetails'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ListOfStories from 'components/list/ListOfStories'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Notifications from 'pages/notifications/Notifications'
import Stats from 'pages/stats/Stats'
import EditingStory from 'pages/stories/EditingStory'

import FilteredStories from 'pages/stories/FilteredStories'
import MyStories from 'pages/stories/MyStories'
import RefineRecommendations from 'pages/tags/RefineRecommendations'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Navbar />
      <Switch>
        <Route exact path='/' component={HomePage} />

        <PrivateRoute exact path='/me/myStories' component={MyStories} />
        <Route exact path='/search/:keyword' component={FilteredStories} />

        <Route exact path='/profile/:id' component={Profile} />

        <Route
          exact
          path='/storyDetails/:id/:resourceId?'
          component={StoryDetails}
        />

        <Route exact path='/listOfStories/:id' component={ListOfStories} />

        <Route exact path='/me/library' component={Library} />

        <PrivateRoute exact path='/newStory' component={NewStory} />

        <PrivateRoute exact path='/editStory/:id' component={EditingStory} />

        <PrivateRoute exact path='/editDraft/:id' component={NewStory} />

        <PrivateRoute
          exact
          path='/refineRecommendations'
          component={RefineRecommendations}
        />

        <PrivateRoute exact path='/notifications' component={Notifications} />

        <PrivateRoute exact path='/me/stats' component={Stats} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
