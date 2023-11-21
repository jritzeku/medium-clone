// @ts-nocheck
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { followUserAction, unfollowUserAction } from 'redux/slices/userSlices'
import showToast from 'utils/showToast'

const StoryAuthor = ({ story }) => {
  const dispatch = useDispatch()

  const author = story?.storyDetails?.user

 
  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const alreadyFollowing = story?.storyDetails?.user?.followers?.some(
    (followerId) => {
      return followerId === userAuth?._id
    }
  )

  const isLoggedInUser = userAuth?._id === story?.storyDetails?.user?.id

  return (
    <>
      <div className='mb-12 flex flex-col gap-2'>
        <div className='flex items-center gap-6'>
          <img
            src={author?.image}
            alt=''
            style={{ width: '60px' }}
            className='rounded-full'
          />

          <Link to={`/profile/${author?._id}`}>
            <span className='text-green-700 cursor-pointer '>view profile</span>
          </Link>
        </div>

        <div>
          <p className='text-[12px]'>
            {author?.firstName} {author?.lastName}
          </p>
          <p className='text-[12px] text-gray-500'>
            {author?.followers.length} Followers
          </p>
        </div>

        <p className='text-[11px] text-gray-500'>{author?.blurb}</p>

        {!isLoggedInUser && (
          <div className='flex gap-4'>
            {alreadyFollowing ? (
              <span
                onClick={() => dispatch(unfollowUserAction(author?._id))}
                className='text-[11px] border-[1px] rounded-full text-green-700 px-3 py-2 cursor-pointer hover:brightness-90'
              >
                Unfollow
              </span>
            ) : (
              <span
                onClick={() => {
                  userAuth
                    ? dispatch(followUserAction(author?._id))
                    : showToast('You must be signed in')
                }}
                className='text-[11px] text-white rounded-full bg-green-700 px-3 py-2 cursor-pointer hover:brightness-90'
              >
                Follow
              </span>
            )}
          </div>
        )}
      </div>

      {/* <!--related topics--> */}
      <div className='w-[300px] border-t-[1px] pt-12'>
        <p className='text-[14px] font-bold mb-4'>
          Topics that author is interested in
        </p>

        <div className='flex flex-wrap gap-2'>
          {author?.recommendedTopics?.map((topic, index) => (
            <span
              key={index}
              onClick={() => {
                const newWindow = window.open(
                  `/search/${topic}`,
                  '_blank',
                  'noopener,noreferrer' //for security reasons
                )
                if (newWindow) newWindow.opener = null
              }}
              className='py-2 px-4 rounded-full bg-gray-100 text-[12px] 
cursor-pointer hover:brightness-90'
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className='h-[400px]'></div>
    </>
  )
}

export default StoryAuthor
