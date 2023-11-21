// @ts-nocheck
import Modal from 'components/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addCommentAction,
  deleteCommentAction,
  editCommentAction,
} from 'redux/slices/commentSlices'

import Comments from './Comments'
import AddComment from './AddComent'
import CommentModal from 'components/modal/CommentModal'

const CommentsModal = ({ id, open, onClose, setOpenComments, resourceId }) => {
  const commentData = useSelector((state) => state?.comment)
  const {
    storyComments,
    commentAdded,
    commentDeleted,
    commentEdited,
    loading,
    appErr,
    serverErr,
  } = commentData

  const [isReplying, setIsReplying] = useState(true)

  const dispatch = useDispatch()

  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  useEffect(() => {}, [commentAdded, commentDeleted, commentEdited])

  const addCommentHandler = (data, parentId) => {
    dispatch(addCommentAction([data, parentId]))
  }

  const removeCommentHandler = (commentId) => {
   
    dispatch(deleteCommentAction(commentId))
  }

  const editCommentHandler = (comment) => {
    dispatch(editCommentAction(comment))
  }

  return (
    <CommentModal width={'600px'} open={open} onClose={onClose}>
      <div className='p-2  h-screen'>
        <div className='flex items-center justify-between px-10 mb-8'>
          <div>
            <p className='text-xl'>Comments</p>
            {!userAuth && (
              <p className='text-[12px] text-gray-600 mt-2'>
                (You must be signed in to leave comments/replies)
              </p>
            )}
          </div>

          <div>
            <img
              onClick={onClose}
              src='/images/close.png'
              alt=''
              style={{ width: '24px' }}
              className='cursor-pointer ml-[90%]'
            />
          </div>
        </div>

        {appErr || serverErr ? (
          <h1>
            {serverErr} {appErr}
          </h1>
        ) : (
          <div className=''>
            {userAuth && (
              <>
                <div
                  className='mt-6 px-10 cursor-pointer text-gray-700 hover:underline'
                  onClick={() => setIsReplying((prevVal) => !prevVal)}
                >
                  {isReplying ? 'Cancel' : 'Add a comment'}
                </div>

                <div className='px-6 my-8'>
                  {isReplying && (
                    <AddComment
                      parentId={id}
                      setIsReplying={setIsReplying}
                      addCommentHandler={addCommentHandler}
                    />
                  )}
                </div>
              </>
            )}

            {storyComments?.length > 0 ? (
              <Comments
                parentId={id}
                comments={storyComments}
                addCommentHandler={addCommentHandler}
                removeCommentHandler={removeCommentHandler}
                editCommentHandler={editCommentHandler}
                resourceId={resourceId}
              />
            ) : (
              <div className='flex items-center justify-between px-10 mb-8'>
                {!loading && <p>No comments exists for this story</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </CommentModal>
  )
}

export default CommentsModal
