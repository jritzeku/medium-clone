import React, { useState } from 'react'

import Draft from './Draft'

const Drafts = ({ drafts, deleteDraftHandler }) => {
  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  return (
    <>
      <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll py-3'>
        {drafts?.length === 0 ? (
          <p>You have no saved drafts</p>
        ) : (
          drafts?.slice(0, visible).map((draft, index) => (
            <li key={index}>
              <Draft draft={draft} deleteDraftHandler={deleteDraftHandler} />
            </li>
          ))
        )}

        {visible < drafts?.length && (
          <button
            onClick={showMorePosts}
            className='mx-auto w-full cursor-pointer border-2'
          >
            Show more
          </button>
        )}
      </ul>
    </>
  )
}

export default Drafts
