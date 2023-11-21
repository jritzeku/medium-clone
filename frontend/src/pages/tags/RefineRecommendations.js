// @ts-nocheck
 
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import SliderTab from 'components/slider-tab/SliderTab'
import AllTags from 'components/story/AllTags'
import AllUsers from 'components/user/AllUsers'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { getAllTagsAction } from 'redux/slices/storySlices'
import { getAllUsersAction, getUserAction } from 'redux/slices/userSlices'

const RefineRecommendations = () => {
  const story = useSelector((state) => state?.story)
  const { allTags, loadingTags, appErr, serverErr } = story

  const user = useSelector((state) => state?.user)
  const {
    allUsers,
    serverEr,
    userAuth,
    userDetails,
    followed,
    unfollowed,
    tagAddedToRecommendations,
    tagRemovedFromRecommendations,
  } = user

  const [activeSection, setActiveSection] = useState('Topics')

  const [topics, setTopics] = useState(['Topics', 'Authors'])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllTagsAction())
    dispatch(getUserAction(userAuth?._id))
    dispatch(getAllUsersAction())
  }, [
    followed,
    unfollowed,
    tagAddedToRecommendations,
    tagRemovedFromRecommendations,
  ])

  return loadingTags ? (
    <div className='flex items-center justify-center mt-[100px] '>
      <ClipLoader
        color={'#008000'}
        loading={loadingTags}
        //  cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : appErr || appErr ? (
    <h1 className=' text-red-400 text-xl'>
      {appErr} {appErr}
    </h1>
  ) : (
    <Main>
      <div  >
        <Content>
          <SliderTab
            topics={topics}
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            defaultSection={'Topics'}
          />

          {activeSection === 'Authors' ? (
            <AllUsers userDetails={userDetails} allUsers={allUsers} />
          ) : (
            <AllTags userDetails={userDetails} allTags={allTags} />
          )}
        </Content>
      </div>
    </Main>
  )
}

export default RefineRecommendations
