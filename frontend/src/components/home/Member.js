// @ts-nocheck
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import Side from 'components/container/Side'
import SliderTab from 'components/slider-tab/SliderTab'
import AllStories from 'components/story/AllStories'

import RecommendedStories from 'components/story/RecommendedStories'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addStoryToListsAction,
  getMyListsAction,
} from 'redux/slices/listSlices'

import showToast from 'utils/showToast'

const Member = ({ userDetails }) => {
  const dispatch = useDispatch()

  const defaultTopic = 'All'
  const [activeSection, setActiveSection] = useState(defaultTopic)
  const [availableTopics, setAvailableTopics] = useState([])

  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const list = useSelector((state) => state?.list)

  let { storyAddedToList } = list

  useEffect(() => {
    if (userAuth) {
    
      dispatch(getMyListsAction())
    }

    setAvailableTopics(['All', 'Following', ...userDetails?.recommendedTopics])
    storyAddedToList = undefined
  }, [storyAddedToList])

  const addToListHandler = (storyId, values) => {
    dispatch(addStoryToListsAction({ storyId, values }))

    showToast('Story added to lits.')
  }

  return (
    <Main>
      <Content>
        <SliderTab
          topics={availableTopics}
          setActiveSection={setActiveSection}
          activeSection={activeSection}
          defaultSection={defaultTopic}
        />

        {activeSection === 'All' ? (
          <AllStories />
        ) : (
          <RecommendedStories
            activeSection={activeSection}
            addToListHandler={addToListHandler}
          />
        )}
      </Content>
    </Main>
  )
}

export default Member
