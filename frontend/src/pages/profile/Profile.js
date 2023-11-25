// @ts-nocheck
import About from 'components/user/About'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  followUserAction,
  getUserAction,
  unfollowUserAction,
} from 'redux/slices/userSlices'

// import EditProfile from 'components/forms/EditProfile'
import AllFollowing from 'components/user/AllFollowing'
import { AiOutlineEdit } from 'react-icons/ai'
import { FaEllipsisH } from 'react-icons/fa'

import Content from 'components/container/Content'
import Main from 'components/container/Main'
import Side from 'components/container/Side'
import Lists from 'components/list/Lists'
import SliderTab from 'components/slider-tab/SliderTab'
import StoriesList from 'components/story/StoriesList'
import {
  getSavedListsAction,
  getUserListsAction,
  removeMyListAction,
  removeSavedListAction,
  saveUserListAction,
} from 'redux/slices/listSlices'
import { getUserStoriesAction } from 'redux/slices/storySlices'

import { ClipLoader } from 'react-spinners'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import showToast from 'utils/showToast'
import EditProfile from 'components/forms/EditProfile'

const Profile = ({ match }) => {
  const [openEdit, setOpenEdit] = useState(false)

  const [showAllFollowing, setShowAllFollowing] = useState(false)

  const [topics, setTopics] = useState([
    'About',
    'Stories',
    'Lists',
    // 'Saved Lists',
  ])
  const [activeSection, setActiveSection] = useState('About')

  const story = useSelector((state) => state?.story)
  const { userStories, storyEdited, storyDeleted, loading, appErr, serverErr } =
    story

  const user = useSelector((state) => state?.user)
  const { userDetails, userEdited, userAuth, followed, unFollowed } = user

  const list = useSelector((state) => state?.list)
  const { listSaved, userLists, savedLists, savedListRemoved, myListRemoved } =
    list

  const dispatch = useDispatch()
  const id = match.params.id

  const saveListHandler = (list) => {
    dispatch(saveUserListAction(list?._id))

    showToast('List has been saved')
  }

  const removeListHandler = (list) => {
    if (list.user?._id === userAuth?._id) {
      dispatch(removeMyListAction(list?._id))
    } else {
      dispatch(removeSavedListAction(list?._id))
    }
    showToast('List has been removed')
  }

  useEffect(() => {
    if (userAuth?._id === id && !topics.includes('Saved Lists')) {
      topics.push('Saved Lists')
    }

    dispatch(getUserAction(id))

    dispatch(getUserStoriesAction(id))

    dispatch(getUserListsAction(id))
    dispatch(getSavedListsAction())
  }, [
    id,
    dispatch,
    followed,
    unFollowed,
    openEdit,
    showAllFollowing,
    listSaved,
    savedListRemoved,
    myListRemoved,
    userEdited,
    storyEdited,
    storyDeleted,
  ])

  const isLoggedInUser = userAuth?._id === userDetails?._id

  const alreadyFollowing = userDetails?.followers?.some((follower) => {
    return follower?._id === userAuth?._id
  })

  return loading ? (
    <div className='flex items-center justify-center mt-[100px]'>
      <ClipLoader
        color={'#008000'}
        loading={loading}
        //  cssOverride={override}
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
      <Side topPos={5}>
        <div className='mb-12 flex flex-col gap-2 '>
          <div className='flex items-center gap-8'>
            <img
              src={userDetails?.image}
              alt=''
              style={{ width: '60px' }}
              className='rounded-full'
            />

            {isLoggedInUser && (
              <div id={`${userAuth?._id} edit`} className='text-[12px]'>
                <div
                  onClick={() => {
                    setOpenEdit(true)
                  }}
                  className='flex gap-2 items-center text-green-700 text-[16px] cursor-pointer hover:brightness-75'
                >
                  <AiOutlineEdit size={20} />
                </div>

                <div>
                  {openEdit && (
                    <EditProfile
                      id={id}
                      open={openEdit}
                      onClose={() => setOpenEdit(false)}
                    />
                  )}
                  <ReactTooltip
                    anchorId={`${userAuth?._id} edit`}
                    place='bottom'
                    content='Edit profile'
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <p className='text-[12px]'>
              {userDetails?.firstName} {userDetails?.lastName}
            </p>
            <p className='text-[12px] text-gray-500'>
              {userDetails?.followers.length} Followers
            </p>
          </div>

          <p className='text-[11px] text-gray-500'>{userDetails?.blurb}</p>

          {!isLoggedInUser && (
            <div className='flex gap-4'>
              {alreadyFollowing ? (
                <span
                  onClick={() => dispatch(unfollowUserAction(userDetails?.id))}
                  className='text-[11px] border-[1px] rounded-full text-green-700 px-3 py-2 cursor-pointer hover:brightness-90'
                >
                  Unfollow
                </span>
              ) : (
                <span
                  onClick={() =>
                    userAuth
                      ? dispatch(followUserAction(userDetails?.id))
                      : showToast('You must be signed in')
                  }
                  className='text-[11px] text-white rounded-full bg-green-700 px-3 py-2 cursor-pointer hover:brightness-90'
                >
                  Follow
                </span>
              )}
            </div>
          )}
        </div>

        {/* others the user is following */}
        <div className='w-[300px] border-t-[1px] pt-12'>
          <p className='text-[14px] font-bold mb-4'>Following</p>

          <ul className='flex flex-col gap-2'>
            {userDetails?.following.map((person, index) => (
              <li
                key={index}
                className='flex items-center justify-between w-[80%]'
              >
                <div className='flex items-center justify-center gap-2 cursor-pointer'>
                  <img
                    src={person?.image}
                    alt=''
                    style={{ width: '18px' }}
                    className='rounded-full'
                  />
                  <p className='text-[12px] text-gray-500'>
                    {person.firstName} {person.lastName}
                  </p>
                </div>

                <div className='relative flex flex-col items-center group'>
                  <FaEllipsisH className='text-gray-600 text-[12px] cursor-pointer hover:brightness-75' />

                  <div className='absolute bottom-[20px] flex flex-col justify-center items-center gap-2 text-[12px] text-gray-500 bg-white mt-2 p-4 hidden w-[250px] border-[1px] rounded-md shadow-md group-hover:block'>
                    <div className='flex flex-col justify-center gap-3'>
                      <div className='flex gap-2 items-center'>
                        <img
                          src={person.image}
                          alt=''
                          style={{ width: '18px', height: '18px' }}
                          className='rounded-full'
                        />

                        <p className='text-[15px]'>
                          {' '}
                          {person.firstName} {person.lastName}{' '}
                        </p>
                      </div>

                      <p>{person.aboutMe}</p>

                      <hr />

                      <div className='flex justify-between gap-2'>
                        <p>{person.followers.length} Followers</p>

                        {person?.followers?.some((follower) => {
                          return follower === userAuth?._id
                        }) ? (
                          <span
                            onClick={() =>
                              dispatch(unfollowUserAction(person?.id))
                            }
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
                            className={`text-[11px] text-white rounded-full bg-green-700 px-3 py-2 cursor-pointer hover:brightness-90 ${
                              person?.id === userAuth?._id ? 'opacity-0' : ''
                            } `}
                          >
                            Follow
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='w-3 h-3 -mb-6 mx-auto rotate-45 border-b-2 border-r-2 bg-white text-center'></div>
                  </div>
                </div>
              </li>
            ))}

            {userDetails?.following.length > 0 ? (
              userDetails?.id.toString() !== userAuth?._id.toString() && (
                <p
                  onClick={() => setShowAllFollowing(true)}
                  className='text-gray-500 text-[10px] mt-4 cursor-pointer showModal hover:brightness-75'
                >
                  See all ({userDetails?.following.length})
                </p>
              )
            ) : (
              <p className='text-gray-500 text-[10px] mt-4 cursor-pointer showModal hover:brightness-75'>
                Not following anyone yet
              </p>
            )}

            {showAllFollowing && (
              <AllFollowing
                id={id}
                open={showAllFollowing}
                onClose={() => setShowAllFollowing(false)}
              />
            )}
          </ul>
        </div>
      </Side>
      <Content>
        <div>
          <p className='text-[38px] mb-4'>
            {userDetails?.firstName} {userDetails?.lastName}
          </p>

          <SliderTab
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            topics={topics}
            defaultSection={'About'}
          />
        </div>

        <div className=''>
          {activeSection === 'About' ? (
            <About
              userDetails={userDetails}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
            />
          ) : activeSection === 'Lists' ? (
            <Lists
              lists={userLists}
              currPage='profile'
              saveListHandler={saveListHandler}
              removeListHandler={removeListHandler}
            />
          ) : activeSection === 'Saved Lists' ? (
            <Lists
              lists={savedLists}
              isSavedLists={true}
              currPage='profile'
              saveListHandler={saveListHandler}
              removeListHandler={removeListHandler}
            />
          ) : (
            <StoriesList stories={userStories} />
          )}
        </div>
      </Content>
    </Main>
  )
}

export default Profile
