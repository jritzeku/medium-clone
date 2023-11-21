import React from 'react'

const Side = ({ children, topPos }) => {

  return (
    <div
      className={`hidden lg:block border-l-[1px] pl-4 fixed right-0 top-[${topPos}px] mt-[100px] py-4 h-screen w-[35%]   pr-5   `}
    >
      {children}
    </div>
  )
}

export default Side
