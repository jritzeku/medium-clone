import Content from 'components/container/Content'
import Main from 'components/container/Main'
import Side from 'components/container/Side'
import Drafts from 'components/draft/Drafts'
import SliderTab from 'components/slider-tab/SliderTab'
import StoriesList from 'components/story/StoriesList'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { deleteDraftAction, getDraftsAction } from 'redux/slices/draftSlices'
import { getUserStoriesAction } from 'redux/slices/storySlices'

const MyStories = () => {
  const dispatch = useDispatch()

  const defaultTopic = 'Drafts'
  const [activeSection, setActiveSection] = useState(defaultTopic)

  const [topics, setTopics] = useState(['Drafts', 'Published'])

  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const story = useSelector((state) => state?.story)
  const {
    userStories,
    loading,
    appErr,
    serverErr,
    storyCreated,
    storyEdited,
    storyDeleted,
  } = story

  const draft = useSelector((state) => state?.draft)

  const { drafts, draftCreated, draftDeleted, draftEdited } = draft

  useEffect(() => {
    dispatch(getDraftsAction())
    dispatch(getUserStoriesAction(userAuth._id))
  }, [
    draftDeleted,
    draftEdited,
    draftCreated,
    storyCreated,
    storyEdited,
    storyDeleted,
  ])

  const deleteDraftHandler = (id) => {
    dispatch(deleteDraftAction(id))
  }

  return loading ? (
    <div className='flex items-center justify-center  mt-[100px]'>
      <ClipLoader
        color={'#008000'}
        loading={loading}
        //  cssOverride={override}
        size={150}
        
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : appErr || serverErr ? (
    <h2 className='text-yellow-400 text-2xl'>
      {serverErr} {appErr}
    </h2>
  ) : (
    <Main>
 

      <Content>
        <div>
          <div className='flex justify-between items-center  '>
            <p className='text-[32px] mb-4'>Your stories</p>

            <Link 
            
            to='/newStory'
            className='hidden md:block'
            >
              <span className='cursor-pointer flex items-center justify-center p-4 h-[40px]  rounded-full bg-green-700 text-white text-[14px] hover:brightness-75'>
                Write a story
              </span>
            </Link>
          </div>

          <SliderTab
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            topics={topics}
            defaultSection={'Your lists'}
          />

          {activeSection === 'Drafts' ? (
            <Drafts drafts={drafts} deleteDraftHandler={deleteDraftHandler} />
          ) : (
            <StoriesList stories={userStories} />
          )}
        </div>
      </Content>
    </Main>
  )
}

export default MyStories
