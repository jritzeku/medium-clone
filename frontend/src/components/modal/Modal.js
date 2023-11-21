import useDisableBodyScroll from 'hooks/useDisableBodyScroll'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

const Modal = ({
  position = 'flex items-center justify-center inset-x-0  ',
  width,
  open,
  onClose,
  children,
  shadowBottom,
  //blurLevel=4
}) => {
  useDisableBodyScroll(open)
 

  if (!open) return null

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={() => {
          onClose()
        }}
        className='overflow-y-scroll  h-screen w-full  fixed inset-x-0   
        z-20 flex items-center justify-center  '
      >
        {/* modal content */}
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          className='  bg-white py-8 rounded-sm shadow-md'
          style={{ width: `${width}` }}
        >
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
