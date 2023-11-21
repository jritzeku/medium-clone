// @ts-nocheck
 
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import {
  addStoryToListsAction,
  getMyListsAction,
} from 'redux/slices/listSlices'
import { getStoriesAction } from 'redux/slices/storySlices'
import showToast from 'utils/showToast'
import Story from './Story'

const AllStories = ({ setShowSide }) => {
  const story = useSelector((state) => state?.story)
  const { allStories, loading, appErr, serverErr } = story

  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const [visible, setVisible] = useState(10)
  const dispatch = useDispatch()

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  const list = useSelector((state) => state?.list)

  const { myLists, loading: loadingMyLists } = list

  const addToListHandler = (storyId, values) => {
    dispatch(addStoryToListsAction({ storyId, values }))
    showToast('Story added to lits.')
  }

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll)
    return () => window.removeEventListener('scroll', listenToScroll)
  }, [])

  useEffect(() => {
    dispatch(getStoriesAction())

    if (userAuth) {
      dispatch(getMyListsAction())
    }
  }, [dispatch])

  const listenToScroll = () => {
    let heightToHideFrom = 600
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop

    if (setShowSide) {
      if (winScroll > heightToHideFrom) {
        setShowSide(true)
      } else {
        setShowSide(false)
      }
    }
  }

  return (
    <div className='overflow-scroll'>
      <p className='text-[14px] font-bold py-6'>Latest on Medium</p>

      <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll'>
        {loading ? (
          <div className='flex items-center justify-center  mt-[100px] '>
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
          <p>No stories found</p>
        ) : (
          allStories?.slice(0, visible).map((story, index) => (
            <li key={index}>
              <Story
                story={story}
                myLists={myLists}
                addToListHandler={addToListHandler}
              />
            </li>
          ))
        )}

        {visible < allStories?.length && (
          <button
            onClick={showMorePosts}
            className=' w-full cursor-pointer border-2'
          >
            Show more
          </button>
        )}
      </ul>
    </div>
  )
}

export default AllStories
