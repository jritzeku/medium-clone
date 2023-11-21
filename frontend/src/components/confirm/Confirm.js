// @ts-nocheck
import Modal from 'components/modal/Modal'
import React from 'react'

const Confirm = ({
  list,
  open,
  onClose,
  setOpenConfirm,
  title,
  msg,
  handlerFunc,
}) => {
  return (
    <Modal width={'600px'} open={open} onClose={onClose}>
      <div className='p-4 px-3'>
        <img
          onClick={onClose}
          src='/images/close.png'
          alt=''
          style={{ width: '24px' }}
          className='cursor-pointer ml-[90%]'
        />

        <div className='flex flex-col items-center gap-6'>
          <p className='text-2xl'>{title}</p>

          <p className='text-gray-500 w-[80%] text-[13px]'> {msg}</p>

          <span
            onClick={() => {
              onClose()
              handlerFunc()
 
            }}
            className='bg-red-600 rounded-full px-4 py-2 text-white text-[12px] hover:brightness-75'
          >
            Proceed
          </span>
        </div>
      </div>
    </Modal>
  )
}

export default Confirm
