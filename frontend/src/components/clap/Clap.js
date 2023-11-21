// @ts-nocheck
import React, { useEffect, useRef } from 'react'

import {
  addClapAction,
  getStoryClapsAction,
  removeUsersClapsAction,
} from 'redux/slices/storySlices'
import { useDispatch, useSelector } from 'react-redux'

import showToast from 'utils/showToast'

const Clap = ({ storyDetails, storyId }) => {
  const clapContainer = useRef()
  const showCount = useRef()

  let clapMaxReached = false

  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const story = useSelector((state) => state?.story)
  const {
    storyClapped,
    storyClaps,
    usersClapsRemoved,
    loading,
    loadingAddClap,
    loadingRemoveClap,
    appErr,
    serverErr,
  } = story

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStoryClapsAction(storyId))
  }, [storyId, storyClapped, usersClapsRemoved])

  const getUsersClapCount = () => {
    let clapCount = storyClaps?.find(
      (clap) => clap.user === userAuth?._id
    )?.clapsByUser

    if (!clapCount) {
      return 0
    } else {
      return clapCount
    }
  }

  const getTotalClapCount = () => {
    return storyClaps?.reduce((acc, clap) => acc + clap?.clapsByUser, 0)
  }

  const isStoryAuthor = () => {
    return userAuth?._id === storyDetails?.user._id
  }

  const clapAnimate = () => {
    if (!clapMaxReached) {
      clapContainer?.current.classList.add('scale-150')
      setTimeout(() => {
        clapContainer?.current.classList.remove('scale-150')
      }, 600)
    }

    showCount?.current.classList.remove('opacity-0')
    setTimeout(() => {
      showCount?.current.classList.add('opacity-0')
    }, 1000)
  }

  const addClap = () => {
    clapAnimate()

    if (!clapMaxReached) {
      dispatch(addClapAction(storyId))
    }
  }

  const removeUsersClaps = () => {
    dispatch(removeUsersClapsAction(storyId))
  }

  return (
    <div className='relative'>
      <div
        ref={showCount}
        className='opacity-0 absolute bottom-[30px] flex items-center justify-center left-[-10px]   h-[30px] rounded-full border-2 cursor-pointer transition duration-200  text-[12px]'
      >
        {getUsersClapCount() === 10 ? (
          <p className='flex items-center justify-center w-[250px] h-[30px]  bg-white rounded-full shadow-sm'>
            Max clap reached, remove claps first.
          </p>
        ) : isStoryAuthor() ? (
          <p className='h-[30px] w-[140px] flex items-center justify-center text-white bg-gray-800 rounded-full'>
            Cant clap on own story
          </p>
        ) : (
          !loadingAddClap && (
            <p className='h-[30px] w-[140px] flex items-center justify-center text-white bg-gray-800 rounded-full'>
              You clapped {getUsersClapCount()} times
            </p>
          )
        )}
      </div>

      <div className='flex gap-2 items-center'>
        <img
          ref={clapContainer}
          onClick={() => {
            userAuth ? addClap() : showToast('You must be signed in')
          }}
          src='/images/clap.png'
          alt=''
          className='cursor-pointer mx-auto'
          style={{ width: '20px' }}
        />

        <p className='text-gray-600 text-[14px]'> {getTotalClapCount()} </p>

        {getUsersClapCount() > 0 && (
          <p
            onClick={removeUsersClaps}
            className=' pl-2 text-gray-500 text-[12px]  cursor-pointer hover:brightness-50 '
          >
            Undo your claps
          </p>
        )}
      </div>
    </div>
  )
}

export default Clap

 