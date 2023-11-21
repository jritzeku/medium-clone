import { useState } from 'react'

import { Link } from 'react-router-dom'

import { AiOutlineEdit, AiTwotoneLock } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'

import Confirm from 'components/confirm/Confirm'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import EditList from './EditList'

const SavedList = ({
  list: savedList,
  userAuth,
  currPage,
  saveListHandler,
  removeListHandler,
  editListHandler,
}) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  return (
    <div className='p-4  gap-8 h-40  bg-gray-100 '>
      <Link
        to={`/listOfStories/${savedList?._id}`}
        className='flex justify-around hover:bg-gray-200 p-2'
      >
        <div className='flex flex-col gap-2 w-[60%] '>
          <div className='flex items-center gap-2'>
            <img
              src={savedList?.user?.image}
              style={{ width: '20px' }}
              alt=''
              className='rounded-full'
            />
            <p className='text-[12px]'>
              {savedList?.user.firstName} {savedList?.user.lastName}
            </p>
          </div>

          <p className='font-bold'>{savedList?.name}</p>

          <div className='flex gap-2 items-center'>
            <p className='text-gray-600 text-[12px]'>
              {savedList?.stories.length} stories
            </p>

            {savedList?.isPrivate && (
              <div
                id={`${savedList?._id} private`}
                className='relative flex flex-col items-center group text-[12px]'
              >
                <AiTwotoneLock size={12} />

                <ReactTooltip
                  //Disregard deprecation warning;  tried non-deprecated options but they dont work
                  // anchorId='add-to-list'
                  anchorId={`${savedList?._id} private`}
                  place='bottom'
                  content='List is private'
                />
              </div>
            )}
          </div>
        </div>

        <ul className='flex gap-1 items-center w-[40%]'>
          {savedList?.stories.slice(0, 3).map((story, index = 1) => (
            <li
            key={index}
            >
              <img
                src={story?.thumbnailImg}
                alt=''
                className={`${
                  index + 1 === 1
                    ? 'w-[120px]'
                    : index + 1 === 2
                    ? 'w-[80px]'
                    : 'w-[40px]'
                } object-cover`}
                style={{ height: '100px' }}
              />
            </li>
          ))}
        </ul>
      </Link>

      <div className=' flex items-center justify-between mt-4 w-[420px] '>
        <div className='flex gap-1'>
          <div className='relative flex flex-col items-center group'>
            {savedList?.user?._id === userAuth?._id && (
              <div className='flex gap-6 items-center'>
                <div id={`${savedList?._id} edit`} className='text-[12px]'>
                  <div
                    onClick={() => {
                      setOpenEdit(true)
                    }}
                    className='flex gap-2 items-center text-green-700 text-[16px] cursor-pointer hover:brightness-75'
                  >
                    {openEdit && (
                      <EditList
                        list={savedList}
                        open={openEdit}
                        onClose={() => setOpenEdit(false)}
                        setOpenEdit={setOpenEdit}
                        editListHandler={editListHandler}
                      />
                    )}

                    <AiOutlineEdit size={20} />
                  </div>

                  <ReactTooltip
                    anchorId={`${savedList?._id} edit`}
                    place='bottom'
                    content='Edit list'
                  />
                </div>

                <div id={`${savedList?._id} delete`} className='text-[12px]'>
                  <div
                    onClick={() => {
                      setOpenConfirm(true)
                    }}
                    className='flex gap-2 items-center text-red-700 text-[16px] cursor-pointer hover:brightness-75'
                  >
                    <BsTrash size={20} />
                  </div>

                  {openConfirm && (
                    <Confirm
                      list={savedList}
                      title='Delete List'
                      msg='Deleting this list will remove it from Your library. If others have saved
                            this list, it will also be deleted and removed from their
                             library. Deleting this list will not delete any stories in it.'
                      open={openConfirm}
                      onClose={() => {
                        setOpenConfirm(false)
                  
                      }}
                      setOpenConfirm={setOpenConfirm}
                      handlerFunc={() => removeListHandler(savedList)}
                    />
                  )}

                  <ReactTooltip
                    //Disregard deprecation warning;  tried non-deprecated options but they dont work
                    // anchorId='add-to-list'
                    anchorId={`${savedList?._id} delete`}
                    place='bottom'
                    content='Delete  list'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedList
