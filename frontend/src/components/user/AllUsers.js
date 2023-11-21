// @ts-nocheck
 
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { followUserAction, unfollowUserAction } from 'redux/slices/userSlices'
import { truncate } from 'utils/truncate'

const AllUsers = ({ userDetails, allUsers }) => {
  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  const dispatch = useDispatch()
  return (
    <div className=' flex flex-col  items-center gap-2  mb-5 overflow-scroll '>
      <p className='font-[18px] text-gray-800 my-4'>
        Following( {userDetails?.following?.length} )
      </p>

      {allUsers
        ?.filter((user) => user?._id !== userAuth?._id)
        .slice(0, visible)
        .map((author, index) => (
          <div key={index} className='flex justify-between px-2 mb-8  w-full  '>
            <div className='flex gap-2 px-2 '>
              <img
                src={author?.image}
                alt=''
                style={{ width: '16px', height: '16px' }}
                className='rounded-full mt-1'
              />

              <div>
                <div className='flex items-center gap-4'>
                  <div>
                    <p className='text-[14px] text-gray-800'>
                      {author?.firstName} {author?.lastName}
                    </p>
                    <p
                      onClick={() => {
                        const newWindow = window.open(
                          `/profile/${author?._id}`,
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
                </div>
                <p className='hidden md:block text-[11px] text-gray-500 h-[80px] '>
                  {truncate(author?.aboutMe.toString(), 200)}
                </p>
              </div>
            </div>

            <div>
              {userDetails?.following?.find(
                (user) => user?._id === author?._id
              ) === undefined ? (
                <span
                  onClick={() => dispatch(followUserAction(author?._id))}
         
                  className={`text-[11px] text-white rounded-full bg-green-700 px-3 py-2 cursor-pointer hover:brightness-90 ${
                    author?.id === userAuth?._id ? 'opacity-0' : ''
                  } `}
                >
                  Follow
                </span>
              ) : (
                <span
                  onClick={() => dispatch(unfollowUserAction(author?._id))}
           
                  className={`text-[11px]  rounded-full border-[1px] text-green-700 px-3 py-2 cursor-pointer hover:brightness-90 ${
                    author?.id === userAuth?._id ? 'opacity-0' : ''
                  } `}
                >
                  Unfollow
                </span>
              )}
            </div>
          </div>
        ))}

      {visible < allUsers?.length && (
        <button
          onClick={showMorePosts}
          className='mx-auto w-[200px] cursor-pointer border-2'
        >
          Show more
        </button>
      )}
    </div>
  )
}

export default AllUsers
