// @ts-nocheck
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import Side from 'components/container/Side'
import Hero from 'components/hero/Hero'
import SearchBox from 'components/search-box/SearchBox'
import AllStories from 'components/story/AllStories'

import TrendingStories from 'components/story/TrendingStories'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { getAllTagsAction } from 'redux/slices/storySlices'

const Guest = () => {
  const [showSide, setShowSide] = useState(false)

  const dispatch = useDispatch()

  const story = useSelector((state) => state?.story)
  const { allTags, loadingTags, appErr, serverErr } = story
  const [maxTags, setMaxTags] = useState(0)

  useEffect(() => {
    dispatch(getAllTagsAction())
    if (allTags?.length < 15) {
      setMaxTags(allTags?.length)
    } else {
      setMaxTags(15)
    }
  }, [])
 
  return (
    <Main>
      <Hero />

      <TrendingStories />


      {showSide && (

        <Side topPos={5}>
          <div className='fixed top-[200px]'>
            <p className='text-[16px] mb-4 px-2'>
              Discover more of what matters to you
            </p>

            <div className='flex flex-wrap gap-2 w-[320px] px-2'>
              {allTags?.slice(0, maxTags).map((tag, index) => (
                <span
                  key={index}
                  className='cursor-pointer p-2 border-[1px] border-gray-300 text-[12px] text-gray-400 hover:brightness-75'
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className='mt-8'>
              <SearchBox />
            </div>
          </div>
        </Side>
      )}

      <Content>
        <AllStories setShowSide={setShowSide} />
      </Content>
    </Main>
  )
}

export default Guest

 