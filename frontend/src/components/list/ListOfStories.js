// @ts-nocheck
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import Story from 'components/story/Story'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  addStoryToListsAction,
  getListAction,
  getMyListsAction,
  removeSavedListAction,
  removeStoryFromListAction,
  saveUserListAction,
} from 'redux/slices/listSlices'
import DateFormatter from 'utils/DateFormatter'

import { AiTwotoneLock } from 'react-icons/ai'
import { ClipLoader } from 'react-spinners'
import { getUserAction } from 'redux/slices/userSlices'
import showToast from 'utils/showToast'

const ListOfStories = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  const listData = useSelector((state) => state?.list)

  const {
    list,
    loading,
    appErr,
    serverErr,
    storyRemovedFromList,
    storyAddedToList,
    listSaved,
    savedListRemoved,
    myLists,
  } = listData

  const user = useSelector((state) => state?.user)
  const { userAuth, userDetails } = user

  const isLoggedInUser = list?.user?._id === userAuth?._id

  useEffect(() => {
    dispatch(getUserAction(userAuth?._id))
    dispatch(getListAction(id))
    dispatch(getMyListsAction())
  }, [listSaved, savedListRemoved, storyRemovedFromList, storyAddedToList])

  const addToListHandler = (storyId, values) => {
    dispatch(addStoryToListsAction({ storyId, values }))
  }

  const removeFromListHandler = (storyId) => {
    dispatch(removeStoryFromListAction([list?._id, storyId]))
  }

  const removeFromSavedListHandler = () => {
    dispatch(removeSavedListAction(list?._id))
    showToast('The saved has been removed')
  }

  const saveListHandler = () => {
    dispatch(saveUserListAction(list?._id))

    showToast('List has been saved')
  }

  return loading ? (
    <div className='flex items-center justify-center mt-[100px]'>
      <ClipLoader
        color={'#008000'}
        loading={loading}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : appErr || serverErr ? (
    <h1 className=' text-red-400 text-xl'>
      {serverErr} {appErr}
    </h1>
  ) : (
    <Main>
      <Content>
        <div>
          <div>
            <div className='overflow-scroll'>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-2 items-center '>
                  <img
                    src={list?.user?.image}
                    alt=''
                    className='rounded-full'
                    style={{ height: '50px', width: '50px' }}
                  />
                  <div>
                    <div className='flex items-center gap-4'>
                      <p>
                        {list?.user?.firstName} {list?.user?.lastName}
                      </p>
                      <p
                        onClick={() => {
                          const newWindow = window.open(
                            `/profile/${list?.user?._id}`,
                            '_blank',
                            'noopener,noreferrer' //for security reasons
                          )
                          if (newWindow) newWindow.opener = null
                        }}
                        className='text-[12px] text-green-700 cursor-pointer hover:brightness-75'
                      >
                        view profile
                      </p>
                    </div>

                    <div className='flex gap-2 items-center text-[12px] text-gray-600'>
                      {list && <span>{DateFormatter(list?.createdAt)}</span>}
                      &#xb7;
                      <span>{list?.stories?.length} stories</span>
                      {list?.isPrivate && (
                        <span>
                          <AiTwotoneLock size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <p className='my-4 text-xl font-bold'> {list?.name}</p>

                  {!isLoggedInUser &&
                    (userDetails?.savedReadingLists?.find(
                      (sl) => sl?._id === list?._id
                    ) === undefined ? (
                      <p
                        onClick={() => {
                          userAuth
                            ? saveListHandler()
                            : showToast('You must be signed in')
                        }}
                        className='text-green-700 cursor-pointer  hover:brightness-90'
                      >
                        Save list
                      </p>
                    ) : (
                      <p
                        onClick={removeFromSavedListHandler}
                        className='text-red-600 cursor-pointer  hover:brightness-90'
                      >
                        Remove from saved list
                      </p>
                    ))}
                </div>
              </div>

              <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll py-3'>
                {list?.stories?.length === 0 ? (
                  <p>No stories exist in list </p>
                ) : (
                  list?.stories?.slice(0, visible).map((story, index) => (
                    <li key={index} className='border-b-[1px] pb-[40px]'>
                      {story.readAt && (
                        <p className='text-gray-500 text-[12px]'>
                          Read on {DateFormatter(story.readAt)}
                        </p>
                      )}
                      <Story
                        myLists={myLists}
                        isLoggedInUser={isLoggedInUser}
                        story={story}
                        addToListHandler={addToListHandler}
                        removeFromListHandler={removeFromListHandler}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {visible < list?.stories?.length && (
            <button
              onClick={showMorePosts}
              className='mx-auto w-full cursor-pointer border-2'
            >
              Show more
            </button>
          )}
        </div>
      </Content>
    </Main>
  )
}

export default ListOfStories

 