// @ts-nocheck
import React, { useRef } from 'react'

import CommentItem from './CommentItem'

const Comments = ({
  comments,
  parentId,
  addCommentHandler,
  removeCommentHandler,
  editCommentHandler,
  resourceId,
}) => {
 
  const commentsData = comments?.filter((c) => parentId === c.parentId)
  const scrollToRef = useRef()

  return (
    <div className='ml-4  '>
      {commentsData?.map((comment, index) => {
        if (resourceId?.toString() === comment?._id?.toString()) {
          scrollToRef?.current?.scrollIntoView()
        }

        const replies = comments?.filter((c) => c.parentId === comment._id)

        return (
          <div key={index}>
            {resourceId?.toString() === comment?._id?.toString() ? (
              <div
                ref={scrollToRef}
                className={`ml-4  ${
                  comment.parentId !== comment.storyId &&
                  'border-l-4 bg-gray-200'
                }`}
              >
                <CommentItem
                  comment={comment}
                  isParent={replies.length > 0}
                  repliesCount={replies.length}
                  addCommentHandler={addCommentHandler}
                  removeCommentHandler={removeCommentHandler}
                  editCommentHandler={editCommentHandler}
                />
              </div>
            ) : (
              <div
                className={`ml-4  ${
                  comment.parentId !== comment.storyId && 'border-l-4'
                }`}
              >
                <CommentItem
                  comment={comment}
                  isParent={replies.length > 0}
                  repliesCount={replies.length}
                  addCommentHandler={addCommentHandler}
                  removeCommentHandler={removeCommentHandler}
                  editCommentHandler={editCommentHandler}
                />
              </div>
            )}

            {replies.length > 0 && (
              <Comments
                comments={comments}
                parentId={comment._id}
                addCommentHandler={addCommentHandler}
                removeCommentHandler={removeCommentHandler}
              />
            )}
          </div>

      
        )
      })}
    </div>
  )
}

export default Comments

 