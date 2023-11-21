// @ts-nocheck
 
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { getTrendingStoriesAction } from 'redux/slices/storySlices'
import DateFormatter from 'utils/DateFormatter'

const TrendingStories = () => {
 
  const story = useSelector((state) => state?.story)
  const {
    loadingTrending,
    trendingStories,

    appErrTrending,
    serverErrTrending,
  } = story

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTrendingStoriesAction())
  }, [])

  return (
    <div id='trending' className='flex justify-center h-[500px]'>
      <div className='w-[80%] border-b-[1px]'>
        <div className='flex gap-2 py-4'>
          <p className='text-[14px] font-bold'>Trending on Medium</p>
        </div>

        <ul className='flex items-center flex-wrap'>
          {loadingTrending ? (
            <div className='flex items-center justify-center '>
              <ClipLoader
                color={'#008000'}
                loading={loadingTrending}
                size={150}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            </div>
          ) : appErrTrending || serverErrTrending ? (
            <h1>
              {serverErrTrending} {appErrTrending}
            </h1>
          ) : (
            trendingStories?.map((story, index) => (
              <li key={index} className='flex gap-2 w-[50%] lg:w-[33%] h-36'>
                <Link to={`/storyDetails/${story?._id}`}>
                  <p className='text-2xl font-bold text-gray-200'>01</p>

                  <div className='flex flex-col text-[12px] gap-2 cursor-pointer'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={story.image}
                        style={{ width: '20px' }}
                        alt=''
                        className='rounded-full'
                      />
                      <p>
                        {story.user.firstName} {story.user.lastName}
                      </p>
                    </div>

                    <p className='font-bold text-xl'>{story.title}</p>

                    <div className='flex gap-2 text-gray-400'>
                      <DateFormatter date={story?.createdAt} />
                      <span> &#xb7;</span>
                      <p> 5 min read</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default TrendingStories
