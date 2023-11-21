// @ts-nocheck
 
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DateFormatter from 'utils/DateFormatter'
import Story from './Story'

const ReadingHistory = ({ addToListHandler, readingHistory }) => {
 

  const list = useSelector((state) => state?.list)

  const { myLists, loading: loadingMyLists } = list

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  return (
    <>
      <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll py-3'>
        {readingHistory?.length === 0 ? (
          <p>
            No reading history yet{' '}
            <span className='text-gray-600 text-[12px]'>
              (must scroll beyond 3/4 of story)
            </span>
          </p>
        ) : (
          readingHistory?.slice(0, visible).map((rh, index) => (
            <li key={index} className='border-b-[1px]  pb-[40px]'>
              {rh.createdAt && (
                <p className='text-gray-500 text-[12px] py-2'>
                  Read on {DateFormatter(rh.createdAt)}
                </p>
              )}
              <Story
                myLists={myLists}
                story={rh.story}
                addToListHandler={addToListHandler}
              />
            </li>
          ))
        )}

        {visible < readingHistory?.length && (
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

export default ReadingHistory

 