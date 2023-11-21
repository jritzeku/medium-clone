// @ts-nocheck
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import List from './List'
import SavedList from './SavedList'

const Lists = ({
  lists,

  isSavedLists,
  currPage,
  removeListHandler,
  editListHandler = undefined,
}) => {
  const user = useSelector((state) => state?.user)
  const { userDetails, userAuth } = user

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  return (
    <>
      <ul className='flex flex-col justify-center gap-4 mb-5 overflow-scroll '>
        {lists?.length === 0 ? (
          <p>No lists found</p>
        ) : (
          lists?.slice(0, visible)?.map((list, index) =>
            isSavedLists ? (
              <li key={index} >
                <SavedList
                  list={list}
                  userAuth={userAuth}
                  removeListHandler={removeListHandler}
                  currPage={currPage}
                  editListHandler={editListHandler}
                />
              </li>
            ) : (
              <li key={index}  >
                <List
                  list={list}
                  userAuth={userAuth}
                  removeListHandler={removeListHandler}
                  currPage={currPage}
                  editListHandler={editListHandler}
                />
              </li>
            )
          )
        )}

        {visible < lists?.length && (
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

export default Lists
