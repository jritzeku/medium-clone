import React, { useEffect, useState } from 'react'

const Content = ({ children, width = 80 }) => {
  return (
    <div className='flex flex-col justify-center items-center pt-24 '>
      <div className={`w-[80%]`}>
        <div className='w-[100%] lg:w-[65%]  pr-4'>{children}</div>
      </div>
    </div>
  )
}

export default Content
