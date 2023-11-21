// @ts-nocheck

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addStoryToListsAction,
  getMyListsAction,
} from 'redux/slices/listSlices'
import DateFormatter from 'utils/DateFormatter'
import showToast from 'utils/showToast'
import Story from './Story'

const StoriesList = ({ stories }) => {
  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }
  const dispatch = useDispatch()

  const list = useSelector((state) => state?.list)
  const { myLists } = list

  const addToListHandler = (storyId, values) => {
    dispatch(addStoryToListsAction({ storyId, values }))
    showToast('Story added to list.')
  }

  useEffect(() => {
    dispatch(getMyListsAction())
  }, [dispatch])

  return (
    <>
      <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll py-3'>
        {stories?.length === 0 ? (
          <p>You have no published stories</p>
        ) : (
          stories?.slice(0, visible).map((story, index) => (
            <li key={index} className='border-b-[1px] pb-[40px]'>
              {story.readAt && (
                <p className='text-gray-500 text-[12px]'>
                  Read on {DateFormatter(story.readAt)}
                </p>
              )}
              <Story
                myLists={myLists}
                story={story}
                addToListHandler={addToListHandler}
              />
            </li>
          ))
        )}

        {visible < stories?.length && (
          <button
            onClick={showMorePosts}
            className='mx-auto w-[200px] cursor-pointer border-2'
          >
            Show more
          </button>
        )}
      </ul>
    </>
  )
}

export default StoriesList
