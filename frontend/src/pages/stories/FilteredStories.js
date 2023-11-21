// @ts-nocheck
 
import React, { useEffect, useState, CSSProperties } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAction } from 'redux/slices/userSlices'
import { connectWithSocketServer } from '../../realtimeCommunication/socketConnection'
import { getStoriesAction } from 'redux/slices/storySlices'
import {
  addStoryToListsAction,
  getMyListsAction,
} from 'redux/slices/listSlices'
import showToast from 'utils/showToast'
import Story from 'components/story/Story'
import Main from 'components/container/Main'

import Side from 'components/container/Side'
import ClipLoader from 'react-spinners/ClipLoader'
import Content from 'components/container/Content'



const FilteredStories = ({ match }) => {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  const keyword = match.params.keyword

  const user = useSelector((state) => state?.user)

  const { userAuth, userDetails, loadingUser, appErrUser, serverErrUser } = user

  const story = useSelector((state) => state?.story)
  const { allStories, loading, appErr, serverErr } = story

  const list = useSelector((state) => state?.list)

  const { myLists, loading: loadingMyLists, storyAddedToList } = list

  const addToListHandler = (storyId, values) => {
    dispatch(addStoryToListsAction({ storyId, values }))
    showToast('Story added to lits.')
  }

  useEffect(() => {
    dispatch(getStoriesAction(keyword))

    if (userAuth) {
      dispatch(getUserAction(userAuth?._id))
      connectWithSocketServer(userAuth)

      dispatch(getMyListsAction())
    }
  }, [keyword, userAuth, storyAddedToList])

  return (
    <Main>
      <>
        <Content>
          <>
            <p className='text-2xl text-gray-500 py-6'>
              Results for{' '}
              <span className='text-xl font-bold text-black'> {keyword}</span>{' '}
            </p>

            <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll'>
              {loading ? (
                <div className='flex items-center justify-center '>
                  <ClipLoader
                    color={'#008000'}
                    loading={loading}
                    size={150}
                    aria-label='Loading Spinner'
                    data-testid='loader'
                  />
                </div>
              ) : appErr || serverErr ? (
                <h1>
                  {serverErr} {appErr}
                </h1>
              ) : allStories?.length === 0 ? (
                <p>No stories found with that keyword</p>
              ) : (
                allStories?.slice(0, visible).map((story, index) => (
                  <li key={index}>
                    <Story
                      myLists={myLists}
                      list={list}
                      story={story}
                      addToListHandler={addToListHandler}
                    />
                  </li>
                ))
              )}
            </ul>

            {visible < allStories?.length && (
              <button
                onClick={showMorePosts}
                className=' w-full cursor-pointer border-2'
              >
                Show more
              </button>
            )}
          </>
        </Content>
      </>
    </Main>
  )
}

export default FilteredStories
