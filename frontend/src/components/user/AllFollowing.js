// @ts-nocheck
 
import Modal from 'components/modal/Modal'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { followUserAction, unfollowUserAction } from 'redux/slices/userSlices'
import showToast from 'utils/showToast'
import { truncate } from 'utils/truncate'

const AllFollowing = ({ id, open, onClose }) => {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  const user = useSelector((state) => state?.user)

  const {
    userDetails,

    userAuth,
    aboutMe,
    isEdited,
    followed, //this
    unFollowed,
  } = user

  useEffect(() => {}, [dispatch, followed, unFollowed])

  return (
    <Modal open={open} onClose={onClose}>
      <img
        onClick={onClose}
        src='/images/close.png'
        alt=''
        style={{ width: '24px' }}
        className='ml-[92%] closeModal cursor-pointer'
      />
      <div className='flex flex-col items-center gap-2 px-3 '>
        <p className='font-[18px] text-gray-800 my-4'>
          {userDetails?.following?.length} Following
        </p>

        {userDetails?.following?.map((person, index) => (
          <div key={index} className='flex justify-center  w-full '>
            <div className='flex gap-2 px-2 '>
              <img
                src={person?.image}
                alt=''
                style={{ width: '16px', height: '16px' }}
                className='rounded-full mt-1'
              />

              <div className=' w-[320px]'>
                <p className='text-[14px] text-gray-800'>
                  {person?.firstName} {person?.lastName}
                </p>
                <p className='text-[11px] text-gray-500 h-[80px] '>
                  {truncate(person?.aboutMe.toString(), 200)}
                </p>
              </div>
            </div>

            <div>
              {person?.followers?.some((follower) => {
                return follower === userAuth?._id
              }) ? (
                <span
                  onClick={() => dispatch(unfollowUserAction(person?.id))}
                  // @ts-ignore
                  className={`text-[11px] border-[1px] rounded-full text-green-700 px-3 py-2 cursor-pointer hover:brightness-90 ${
                    person?.id === userAuth?._id ? 'opacity-0' : ''
                  } `}
                >
                  Unfollow
                </span>
              ) : (
                <span
                  onClick={() =>
                    userAuth
                      ? dispatch(followUserAction(person?.id))
                      : showToast('You must be signed in')
                  }
                  // @ts-ignore
                  className={`text-[11px] text-white rounded-full bg-green-700 px-3 py-2 cursor-pointer hover:brightness-90 ${
                    person?.id === userAuth?._id ? 'opacity-0' : ''
                  } `}
                >
                  Follow
                </span>
              )}
            </div>
          </div>
        ))}

        {visible < userDetails?.following?.length && (
          <button
            onClick={showMorePosts}
            className='mx-auto w-full cursor-pointer border-2'
          >
            Show more
          </button>
        )}
      </div>
    </Modal>
  )
}

export default AllFollowing

 