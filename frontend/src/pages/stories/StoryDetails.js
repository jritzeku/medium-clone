import { useEffect, useRef, useState } from 'react'

// @ts-ignore
import { Link, useHistory } from 'react-router-dom'

import Clap from 'components/clap/Clap'
import CommentsModal from 'components/comment/CommentsModal'
import Side from 'components/container/Side'
import useElementOnScreen from 'hooks/useElementOnScreen'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiMessageRounded } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteCommentAction,
  getStoryCommentsAction,
} from 'redux/slices/commentSlices'
import {
  deleteStoryAction,
  editStoryAction,
  getStoryAction,
  markStoryReadAction,
  markStoryViewedAction,
} from 'redux/slices/storySlices'

import Confirm from 'components/confirm/Confirm'
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import AddToList from 'components/forms/AddToList'
import StoryAuthor from 'components/story/StoryAuthor'
import { BsBookmarks, BsTrash } from 'react-icons/bs'
import { ClipLoader } from 'react-spinners'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { addStoryToListsAction } from 'redux/slices/listSlices'
import showToast from 'utils/showToast'

const StoryDetails = ({
  match: {
    params: { id, resourceId },
  },
}) => {
  const dispatch = useDispatch()

  // @ts-ignore
  const [openEdit, setOpenEdit] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const [storyRead, setStoryRead] = useState(false)

  const [openComments, setOpenComments] = useState(resourceId !== undefined)

  // @ts-ignore
  const story = useSelector((state) => state?.story)

  // @ts-ignore
  const removeCommentHandler = (commentId) => {
    // @ts-ignore
    dispatch(deleteCommentAction(commentId))
  }

  const {
    storyDetails,
    storyEdited,
    storyDeleted,
    loadingStory,
    appErrStory,
    serverErrStory,
  } = story

  // @ts-ignore
  const commentData = useSelector((state) => state?.comment)
  const { storyComments, commentAdded, commentEdited, commentDeleted } =
    commentData

  useEffect(() => {
    // @ts-ignore
    dispatch(getStoryCommentsAction(id))
  }, [commentAdded, commentEdited, commentDeleted])

  const history = useHistory()

  // @ts-ignore
  const editStoryHandler = (id, data) => {
    // @ts-ignore
    dispatch(editStoryAction([id, data]))
  }

  const deleteStoryHandler = () => {
    // @ts-ignore
    dispatch(deleteStoryAction(storyDetails?._id))

    history.push('/')
  }

  const thumbnailElem = useRef(null)

  // @ts-ignore
  const user = useSelector((state) => state?.user)
  const { userAuth, followed, unFollowed } = user
  const targetRef = useRef(null)

  const isLoggedInUser = userAuth?._id === storyDetails?.user?._id

  const isVisible = useElementOnScreen(
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.75,
    },
    targetRef
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    // @ts-ignore
    dispatch(getStoryAction(id))

    if (userAuth) {
      // @ts-ignore
      dispatch(markStoryViewedAction(id))
    }
  }, [storyEdited, storyDeleted, followed, unFollowed])

  if (isVisible && !storyRead) {
    setStoryRead(true)

    if (userAuth) {
      // @ts-ignore
      dispatch(markStoryReadAction(id))
    }
  }

  // @ts-ignore
  const list = useSelector((state) => state?.list)

  const [showListChoices, setShowListChoices] = useState(false)

  const { myLists } = list

  const addToListHandler = (storyId, values) => {
    // @ts-ignore
    dispatch(addStoryToListsAction({ storyId, values }))

    showToast('Story added to list.')
  }

  return loadingStory ? (
    <div className='flex items-center justify-center mt-[200px]  '>
      <ClipLoader
        color={'#008000'}
        loading={loadingStory}
        //  cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : appErrStory || serverErrStory ? (
    <h1 className=' text-red-400 text-xl'>
      {serverErrStory} {appErrStory}
    </h1>
  ) : (
    <Main>
      <Side topPos={100}>
        <StoryAuthor story={story} />
      </Side>

      <Content>
        <div className='flex flex-col p-2 gap-4 cursor-pointer'>
          <div className='flex items-center justify-between'>
            <p className='text-2xl'>{storyDetails?.title}</p>

            {isLoggedInUser && (
              <div className='flex gap-2'>
                <Link to={`/editStory/${storyDetails?._id}`}>
                  <div className='flex gap-2 items-center text-white text-[12px] cursor-pointer hover:brightness-75'>
                    <div
                      id={`${story?._id} edit`}
                      className='relative flex flex-col items-center group  text-[12px] text-green-700'
                    >
                      <AiOutlineEdit size={20} />
                    </div>

                    <ReactTooltip
                      //Disregard deprecation warning;  tried non-deprecated options but they dont work
                      // anchorId='add-to-list'
                      anchorId={`${storyDetails?._id} edit`}
                      place='bottom'
                      content='Edit Story'
                    />
                  </div>
                </Link>
                <div
                  onClick={() => {
                    setOpenConfirm(true)
                  }}
                  className='flex gap-2 items-center text-gray-600 text-[16px] cursor-pointer hover:brightness-75'
                >
                  <div className='relative flex flex-col items-center group  '>
                    <BsTrash size={20} />

                    <div className='absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex'>
                      {openConfirm && (
                        // @ts-ignore
                        <Confirm
                          title='Delete Story'
                          msg='Are you sure you want to delete your story?'
                          open={openConfirm}
                          onClose={() => {
                            setOpenConfirm(false)
                          }}
                          setOpenConfirm={setOpenConfirm}
                          handlerFunc={deleteStoryHandler}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={thumbnailElem}>
            <img src={storyDetails?.thumbnailImg} alt='' className='my-6' />
          </div>

          <div ref={targetRef} className='my-4 text-[14px]'>
            <div
              dangerouslySetInnerHTML={{ __html: storyDetails?.content }}
            ></div>
          </div>
        </div>

        {/*Bottom info */}
        <div className='flex flex-col gap-5 my-[80px]  '>
          <div className='flex gap-2'>
            {storyDetails?.tags.map((tag, index) => (
              <span
                key={index}
                onClick={() => {
                  const newWindow = window.open(
                    `/search/${tag}`,
                    '_blank',
                    'noopener,noreferrer' //for security reasons
                  )
                  if (newWindow) newWindow.opener = null
                }}
                className='py-2 px-4 rounded-full bg-gray-100 text-[12px] 
                    cursor-pointer hover:brightness-90'
              >
                {tag}
              </span>
            ))}
          </div>

          <div className='flex items-center justify-between  gap-2  '>
            <div className='flex gap-4 items-center'>
              <Clap storyDetails={storyDetails} storyId={id} />

              <div
                onClick={() => setOpenComments(true)}
                className='cursor-pointer flex items-center gap-1'
              >
                <BiMessageRounded />
                <span className='text-gray-600 text-[12px]'>
                  {storyComments?.length}
                </span>
              </div>

              {openComments && (
                // @ts-ignore
                <CommentsModal
                  id={id}
                  open={openComments}
                  onClose={() => setOpenComments(false)}
                  setOpenComments={setOpenComments}
                  resourceId={resourceId}
                />
              )}
            </div>

            <div className='flex gap-3'>
              <div className='flex gap-1'>
                <div
                  id={`${story?._id} list`}
                  onClick={() =>
                    userAuth
                      ? setShowListChoices(true)
                      : showToast('You must be signed in')
                  }
                  className='relative flex flex-col items-center group  text-[12px]'
                >
                  <button className=''>
                    <BsBookmarks />
                  </button>

                  <div
                    className={`${
                      showListChoices
                        ? 'p-3 z-20 border border-2 bg-white invisible border-gray-200 rounded w-60 absolute left-50 top-[-100px] z-4 transition-all opacity-0  group-focus-within:translate-y-1 group-focus-within:visible group-focus-within:opacity-100'
                        : 'hidden'
                    }`}
                  >
                    <AddToList
                      myLists={myLists}
                      story={storyDetails}
                      addToListHandler={addToListHandler}
                      setShowListChoices={setShowListChoices}
                    />
                  </div>

                  <ReactTooltip
                    //Disregard deprecation warning;  tried non-deprecated options but they dont work
                    // anchorId='add-to-list'
                    anchorId={`${story?._id} list`}
                    place='bottom'
                    content='Add to list'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Main>
  )
}

export default StoryDetails
