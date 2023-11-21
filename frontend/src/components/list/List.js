import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { AiOutlineEdit, AiTwotoneLock } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'
import { useDispatch } from 'react-redux'

import Confirm from 'components/confirm/Confirm'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import EditList from './EditList'

const List = ({
  list,
  userAuth,
  currPage,
  saveListHandler,
  removeListHandler,
  editListHandler,
}) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {}, [])

  return (
    <div className='p-4   gap-8 h-40  bg-gray-100 '>
      <Link
        to={`/listOfStories/${list?._id}`}
        className='flex justify-around hover:bg-gray-200 p-2'
      >
        <div className='flex flex-col gap-2 w-[60%] '>
          <div className='flex items-center gap-2'>
            <img
              src={list?.user?.image}
              style={{ width: '20px' }}
              alt=''
              className='rounded-full'
            />
            <p className='text-[12px]'>
              {list?.user.firstName} {list?.user.lastName}
            </p>
          </div>

          <p className='font-bold'>{list?.name}</p>

          <div className='flex gap-2 items-center'>
            <p className='text-gray-600 text-[12px]'>
              {list?.stories.length} stories
            </p>

            {list?.isPrivate && (
              <div
                id={`${list?._id} private`}
                className='relative flex flex-col items-center group text-[12px]'
              >
                <AiTwotoneLock size={12} />

                <ReactTooltip
                  //Disregard deprecation warning;  tried non-deprecated options but they dont work
                  // anchorId='add-to-list'
                  anchorId={`${list?._id} private`}
                  place='bottom'
                  content='List is private'
                />
              </div>
            )}
          </div>
        </div>

        <ul className='flex gap-1 items-center w-[40%]'>
          {list?.stories.slice(0, 3).map((story, index = 1) => (
            <li key={index}>
              <img
                src={story.thumbnailImg}
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

      <div className=' bg-gray-100  flex items-center justify-between  w-[420px] '>
        <div className='flex gap-1'>
          <div className='relative flex flex-col items-center group'>
            {list?.user?._id === userAuth?._id && (
              <div className='flex gap-6 items-center'>
                {!list?.isDefault && (
                  <div id={`${list?._id} edit`} className='text-[12px]'>
                    <div
                      onClick={() => {
                        setOpenEdit(true)
                      }}
                      className='flex gap-2 items-center text-green-700 text-[16px] cursor-pointer hover:brightness-75'
                    >
                      {openEdit && (
                        <EditList
                          list={list}
                          open={openEdit}
                          onClose={() => setOpenEdit(false)}
                          setOpenEdit={setOpenEdit}
                          editListHandler={editListHandler}
                        />
                      )}

                      <AiOutlineEdit size={20} />
                    </div>

                    <ReactTooltip
                      anchorId={`${list?._id} edit`}
                      place='bottom'
                      content='Edit list'
                    />
                  </div>
                )}

                {!list?.isDefault && (
                  <div id={`${list?._id} delete`} className='text-[12px]'>
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
                        list={list}
                        title='Delete List'
                        msg='Deleting this list will remove it from Your library. If others have saved 
        this list, it will also be deleted and removed from their
         library. Deleting this list will not delete any stories in it.'
                        open={openConfirm}
                        onClose={() => {
                          setOpenConfirm(false)
                        }}
                        setOpenConfirm={setOpenConfirm}
                        handlerFunc={() => removeListHandler(list)}
                      />
                    )}

                    <ReactTooltip
                      //Disregard deprecation warning;  tried non-deprecated options but they dont work
                      // anchorId='add-to-list'
                      anchorId={`${list?._id} delete`}
                      place='bottom'
                      content='Delete  list'
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List

 