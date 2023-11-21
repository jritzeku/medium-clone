// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'

import DateFormatter from 'utils/DateFormatter'
import { BsTrash } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { AiOutlineEdit } from 'react-icons/ai'
import AddComment from './AddComent'
import EditComment from './EditComment'

const CommentItem = ({
  comment,
  parentCollapsed,
  isParent,
  repliesCount,
  addCommentHandler,
  removeCommentHandler,
  editCommentHandler,
}) => {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const user = useSelector((state) => state?.user)
  const { userAuth, loadingUser, appErrUser, serverErrUser } = user

  

  return (
    <>
      {isEditing ? (
        <div>
          <p
            onClick={() => setIsEditing(false)}
            className='ml-4 mt-8 text-gray-700 cursor-pointer hover:underline'
          >
            Cancel 
          </p>
          <EditComment
            comment={comment}
            setIsEditing={setIsEditing}
            editCommentHandler={editCommentHandler}
          />
        </div>
      ) : (
        <div className='p-4 m-2 '>
          <div className='flex items-center justify-between '>
            <div className='flex gap-2 items-center  '>
              <img
                src={comment.user?.image}
                alt=''
                style={{ width: '25px' }}
                className='rounded-full'
              />

              <p className='text-[12px]'> {comment.user.firstName}</p>

              <p className='text-[12px] text-gray-500'>
                {<DateFormatter date={comment?.createdAt} />}
              </p>
            </div>

            {userAuth?._id === comment.user._id && (
              <div className='flex gap-4'>
                <div
                  className='cursor-pointer'
                  onClick={() => {
                    setIsEditing(true)
                  }}
                >
                  <AiOutlineEdit size={20} />
                </div>

                <div
                  className='cursor-pointer  '
                  onClick={() => {
                    removeCommentHandler(comment?._id)
                  }}
                >
                  <BsTrash size={20} />
                </div>
              </div>
            )}
          </div>

          <p className='my-4'>{comment.content}</p>

          <div className=''>
            {userAuth && (
              <span
                onClick={() => setIsReplying((prevVal) => !prevVal)}
                className='cursor-pointer text-gray-700 hover:underline '
              >
                {isReplying ? 'Cancel' : 'Reply'}
              </span>
            )}
          </div>

          {isReplying && (
            <AddComment
              parentId={comment._id}
              setIsReplying={setIsReplying}
              addCommentHandler={addCommentHandler}
            />
          )}

          <hr className='my-2' />
        </div>
      )}
    </>
  )
}

export default CommentItem
