// @ts-nocheck
import React, { useState } from 'react'
import { truncate } from 'utils/truncate'
import DateFormatter from 'utils/DateFormatter'
import { AiOutlineEdit } from 'react-icons/ai'
import Confirm from 'components/confirm/Confirm'

import { BsTrash } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const Draft = ({ draft, deleteDraftHandler }) => {
  const [openConfirm, setOpenConfirm] = useState(false)

  return (
    <div className='flex flex-col gap-2 border-b-[1px] pb-[40px] px-6'>
      <div className='flex items-center justify-between mt-6'>
        <p className='fond-extrabold'>{draft.title}</p>

        <div className='flex gap-2 '>
          <Link to={`/editDraft/${draft?._id}`}>
            <div className='flex gap-2 items-center text-green-700 text-[16px] cursor-pointer hover:brightness-75'>
              <div className='relative flex flex-col items-center group'>
                <AiOutlineEdit size={20} />

                <div className='absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex'>
                  <span className='text-center w-[70px] relative z-10 p-2 text-[10px] leading-none text-white whitespace-no-wrap bg-gray-800 shadow-lg'>
                    Edit Draft
                  </span>

                  <div className='w-3 h-3 -mt-2 rotate-45 bg-gray-800'></div>
                </div>
              </div>
            </div>
          </Link>

          <div
            onClick={() => {
              setOpenConfirm(true)
            }}
            className='flex gap-2 items-center text-red-700 text-[16px] cursor-pointer hover:brightness-75'
          >
            <div className='relative flex flex-col items-center group  '>
              <BsTrash size={20} />

              <div className='absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex'>
                <span className='text-center w-[70px] relative z-10 p-2 text-[10px] leading-none text-white whitespace-no-wrap bg-gray-800 shadow-lg'>
                  Delete draft
                </span>
                {openConfirm && (
                  <Confirm
                    title='Delete Draft'
                    msg='Are you sure you want to delete this draft? Your progress will be lost.'
                    open={openConfirm}
                    onClose={() => {
                      setOpenConfirm(false)
                    }}
                    setOpenConfirm={setOpenConfirm}
                    handlerFunc={() => deleteDraftHandler(draft._id)}
                  />
                )}

                <div className='w-3 h-3 -mt-2 rotate-45 bg-gray-800'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        className='text-[12px] text-gray-700'
        dangerouslySetInnerHTML={{ __html: truncate(draft?.content) }}
      ></p>

      <p className='text-gray-500 text-[12px]'>
        Last edited on {DateFormatter(draft.updatedAt)}
      </p>
    </div>
  )
}

export default Draft

 