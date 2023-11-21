// @ts-nocheck
//import React from 'react'
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import CreateList from 'components/list/CreateList'
import Lists from 'components/list/Lists'

import SliderTab from 'components/slider-tab/SliderTab'
import ReadingHistory from 'components/story/ReadingHistory'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import {
  addStoryToListsAction,
  editListAction,
  getMyListsAction,
  getSavedListsAction,
  removeMyListAction,
  removeSavedListAction,
} from 'redux/slices/listSlices'
import { getMyReadingHistoryAction } from 'redux/slices/storySlices'
import { getUserAction } from 'redux/slices/userSlices'
import showToast from 'utils/showToast'

const Library = () => {
  const dispatch = useDispatch()

  const [openEdit, setOpenEdit] = useState(false)

  const defaultTopic = 'Your lists'
  const [activeSection, setActiveSection] = useState(defaultTopic)

  const [topics, setTopics] = useState([
    'Your lists',
    'Saved lists',
    'Reading history',
  ])

  const user = useSelector((state) => state?.user)

  const list = useSelector((state) => state?.list)
  const {
    myLists,
    savedLists,
    savedListRemoved,
    myListRemoved,
    listCreated,
    listEdited,
    loading,
    appErr,
    serverErr,
  } = list

  const story = useSelector((state) => state?.story)
  const { readingHistory, loading: loaadingReadingHiStory } = story

  const { userAuth, userDetails, loading: loading2 } = user

  useEffect(() => {
    dispatch(getMyListsAction())
    dispatch(getSavedListsAction())
    dispatch(getUserAction(userAuth?._id))
    dispatch(getMyReadingHistoryAction())
  }, [
    dispatch,
    savedListRemoved,
    myListRemoved,
    openEdit,
    listCreated,
    listEdited,
  ])

  const addToListHandler = (storyId, values) => {
    dispatch(addStoryToListsAction({ storyId, values }))
    showToast('Story added to lits.')
  }

  const editListHandler = (listId, listData) => {
 
    dispatch(editListAction([listId, listData]))
  }

  const removeListHandler = (list) => {
 
    if (list.user?._id === userAuth?._id) {
 
      dispatch(removeMyListAction(list._id))
    } else {
 
      dispatch(removeSavedListAction(list._id))
    }
  }

  return loading ? (
    <div className='flex items-center justify-center  mt-[100px]'>
      <ClipLoader
        color={'#008000'}
        loading={loading}
        
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
      {openEdit && (
        <CreateList
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          setOpenEdit={setOpenEdit}
        />
      )}

      <Content>
        <div>
          <div className='flex justify-between items-center  '>
            <p className='text-[32px] mb-4'>Your library</p>

            <span
              onClick={() => {
                setOpenEdit(true)
              }}
              className='cursor-pointer flex items-center justify-center p-4 h-[40px]  rounded-full bg-green-700 text-white text-[14px] hover:brightness-75'
            >
              New List
            </span>
          </div>

          <SliderTab
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            topics={topics}
            defaultSection={'Your lists'}
          />

          {activeSection === 'Your lists' ? (
            !myLists ? (
              <p>You have not created any list yet</p>
            ) : (
              <Lists
                lists={myLists}
                currPage='library'
                removeListHandler={removeListHandler}
                editListHandler={editListHandler}
              />
            )
          ) : activeSection === 'Saved lists' ? (
            <Lists
              lists={savedLists}
              isSavedLists={true}
              currPage='profile'
              removeListHandler={removeListHandler}
            />
          ) : (
            <ReadingHistory
              addToListHandler={addToListHandler}
              readingHistory={readingHistory}
            />
          )}
        </div>
      </Content>
    </Main>
  )
}

export default Library
