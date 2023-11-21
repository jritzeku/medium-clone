// @ts-nocheck
 
import { useEffect, useState } from 'react'
import { HiOutlineNewspaper } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesAction } from 'redux/slices/storySlices'
import {
  addTagToRecommendationsAction,
  removeTagFromRecommendationsAction,
} from 'redux/slices/userSlices'

const AllTags = ({ userDetails, allTags }) => {
  const user = useSelector((state) => state?.user)
  const { userAuth } = user
  const dispatch = useDispatch()

  const story = useSelector((state) => state?.story)
  const { allStories } = story

  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  useEffect(() => {
    getStoriesAction()
  }, [])

  return (
    <div className='flex flex-col items-center gap-2  mb-5 overflow-scroll '>
      <p className='font-[18px] text-gray-800 my-4'>
        Tags( {allTags?.length} )
      </p>

      {allTags?.slice(0, visible).map((tag, index) => (
        <div key={index} className='flex justify-between px-2 mb-8  w-full  '>
          <div className='flex gap-2 px-2   '>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-gray-100 rounded-full'>
                <HiOutlineNewspaper />
              </div>

              <div>
                <p className='text-[14px] text-gray-800 hover:brightness-75'>
                  {tag}
                </p>
                <p className='text-[12px] text-gray-600'>
                  {
                    allStories?.filter((story) => story?.tags?.includes(tag))
                      .length
                  }
                  total stories
                </p>
                <p
                  onClick={() => {
                    const newWindow = window.open(
                      `/search/${tag}`,
                      '_blank',
                      'noopener,noreferrer' //for security reasons
                    )
                    if (newWindow) newWindow.opener = null
                  }}
                  className='cursor-pointer text-[12px] text-green-700'
                >
                  view stories
                </p>
              </div>
            </div>
          </div>

          {/* follow/unfollow */}
          <div>
            {userDetails?.recommendedTopics?.includes(tag.toString()) ? (
              <span
                onClick={() =>
                  dispatch(removeTagFromRecommendationsAction({ tag }))
                }
                // @ts-ignore
                className={`text-[11px] border-[1px] rounded-full  px-3 py-2 cursor-pointer hover:brightness-90 `}
              >
                Unsubscribe
              </span>
            ) : (
              <span
                onClick={() => dispatch(addTagToRecommendationsAction({ tag }))}
          
                className={`text-[11px] text-white bg-green-700  rounded-full  px-3 py-2 cursor-pointer hover:brightness-90 `}
              >
                Subscribe
              </span>
            )}
          </div>
        </div>
      ))}

      {visible < allTags?.length && (
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

export default AllTags
