// @ts-nocheck
 
import { useState } from 'react'

import Confirm from 'components/confirm/Confirm'
import AddToList from 'components/forms/AddToList'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsBookmarks, BsTrash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { deleteStoryAction } from 'redux/slices/storySlices'
import DateFormatter from 'utils/DateFormatter'
import showToast from 'utils/showToast'
import { truncate } from 'utils/truncate'

const Story = ({
  myLists,
  story,
  addToListHandler,
  removeFromListHandler,
  isLoggedInUser,
}) => {
  const dispatch = useDispatch()
  const [openConfirm, setOpenConfirm] = useState(false)
  const user = useSelector((state) => state?.user)
  const {
    userAuth,

    loading: loading2,
    appErr: appErr2,
    serverErr: serverErr2,
  } = user

  const [showListChoices, setShowListChoices] = useState(false)

  return (
    <div className='bg-gray-100 p-2  gap-8 cursor-pointer  '>
      <div className='cursor-pointer hover:bg-gray-200 py-2 relative'>
        <Link
          to={`/storyDetails/${story?._id}`}
          className='   flex-col  md:flex-row md:flex justify-between px-2 '
        >
          <div className='flex flex-col gap-2 w-[60%] '>
            <div className='flex items-center gap-2'>
              <img
                src={story?.user?.image}
                style={{ width: '20px' }}
                alt=''
                className='rounded-full'
              />
              <p className='text-[12px]'>
                {story?.user?.firstName} {story?.user?.lastName}
              </p>
            </div>

            <p className='font-bold'>{story?.title}</p>

            <p
              dangerouslySetInnerHTML={{ __html: truncate(story?.content) }}
              className=' w-[380px] mb-2  md:w-full overflow-hidden text-gray-600 text-[14px] font-serif  '
            ></p>

            {/* Bottom section */}
          </div>

          <div className='px-2 justify-center gap-1 md:items-center md:w-[140px]  '>
            <img
              src={story?.thumbnailImg}
              alt=''
              className='object-contain'
       
            />
          </div>
        </Link>
      </div>
      <div className='flex justify-between ml-10 py-4 '>
        <div className='flex gap-2 text-gray-400 text-[12px]'>
          <DateFormatter date={story?.createdAt} />
        </div>

        <div className='flex gap-1'>
          <div
            /*
  -Since we are looping over bunch of story, we want to keep id UNIQUE! For this reason we
  are simply using story._id for 'id' value. 
  
  */
            id={`${story?._id} add_to_list`}
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
                  ? 'p-3 z-20  border-2 bg-white invisible border-gray-200 rounded w-60 absolute left-50 top-[-100px] z-4 transition-all opacity-0  group-focus-within:translate-y-1 group-focus-within:visible group-focus-within:opacity-100'
                  : 'hidden'
              }`}
            >
              <AddToList
                myLists={myLists}
                story={story}
                addToListHandler={addToListHandler}
                setShowListChoices={setShowListChoices}
              />
            </div>

            <div className='text-[12px]'>
              <ReactTooltip
                //Disregard deprecation warning;  tried non-deprecated options but they dont work
                // anchorId='add-to-list'
                anchorId={`${story?._id} add_to_list`}
                place='bottom'
                content='Add to list'
              />
            </div>
          </div>
        </div>

        {isLoggedInUser && (
          <div className='flex gap-1'>
            <div
              id={`${story?._id} remove_from_list`}
              onClick={() => {
                setOpenConfirm(true)
              }}
              className='relative flex flex-col items-center group  text-[12px]'
            >
              <button className=''>
                <BsTrash />
              </button>
            </div>

            {openConfirm && (
              <Confirm
                title='Delete story from List'
                msg='Are you sure you want to delete this story from the list?'
                open={openConfirm}
                onClose={() => {
                  setOpenConfirm(false)
                }}
                setOpenConfirm={setOpenConfirm}
                handlerFunc={() => {
                  removeFromListHandler(story?._id)
                }}
              />
            )}

            <div className='text-[12px]'>
              <ReactTooltip
                //Disregard deprecation warning;  tried non-deprecated options but they dont work
                // anchorId='add-to-list'
                anchorId={`${story?._id} remove_from_list`}
                place='bottom'
                content='Remove from list'
              />
            </div>
          </div>
        )}

        <div>
          {userAuth?._id === story?.user?._id && (
            <div className='flex items-center gap-4'>
              <Link to={`/editStory/${story?._id}`}>
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
                    anchorId={`${story?._id} edit`}
                    place='bottom'
                    content='Edit Story'
                  />
                </div>
              </Link>

              <div
                id={`${story?._id} delete`}
                onClick={() => {
                  setOpenConfirm(true)
                }}
                className='flex gap-2 items-center  text-[12px] cursor-pointer hover:brightness-75 text-white'
              >
                <div className='relative flex flex-col items-center group  text-red-700  '>
                  <BsTrash size={20} />

                  {openConfirm && (
                    <Confirm
                      title='Delete story'
                      msg='Are you sure you want to delete this story?'
                      open={openConfirm}
                      onClose={() => {
                        setOpenConfirm(false)
                      }}
                      setOpenConfirm={setOpenConfirm}
                      handlerFunc={() =>
                        dispatch(deleteStoryAction(story?._id))
                      }
                    />
                  )}

                  <ReactTooltip
                    //Disregard deprecation warning;  tried non-deprecated options but they dont work
                    // anchorId='add-to-list'
                    anchorId={`${story?._id} delete`}
                    place='bottom'
                    content='Delete story'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Story

 