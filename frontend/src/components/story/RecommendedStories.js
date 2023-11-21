// @ts-nocheck
 
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRecommendedStoriesAction } from 'redux/slices/storySlices'

import 'react-loading-skeleton/dist/skeleton.css'
import { ClipLoader } from 'react-spinners'
import Story from './Story'

const RecommendedStories = ({ activeSection, addToListHandler }) => {
  // @ts-ignore

  const story = useSelector((state) => state?.story)
  const { recommendedStories, loading, appErr, serverErr } = story

  const [visible, setVisible] = useState(10)

  const list = useSelector((state) => state?.list)

  const { myLists, loading: loadingMyLists } = list

  const dispatch = useDispatch()

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  useEffect(() => {

  
    dispatch(getRecommendedStoriesAction(activeSection))
  }, [activeSection, myLists])

  return (
    <div className=''>
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
      ) : (
        <ul className='mt-5 flex flex-col justify-center gap-8 mb-5  '>
          {recommendedStories?.length === 0 ? (
            <>
              <p>No stories exist </p>

              {activeSection === 'Following' && (
                <p className='text-[12px] text-gray-600'>
                  (Stories from authors you follow will appear here)
                </p>
              )}
            </>
          ) : (
            recommendedStories?.slice(0, visible).map((story, index) => (
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

          {visible < recommendedStories?.length && (
            <button
              onClick={showMorePosts}
              className='mx-auto w-full cursor-pointer border-2'
            >
              Show more
            </button>
          )}
        </ul>
      )}
    </div>
  )
}

export default RecommendedStories

 