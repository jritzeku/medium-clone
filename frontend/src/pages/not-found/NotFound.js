import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className=" h-screen  flex flex-col items-center justify-center gap-4">
      <p className='text-4xl'>404 - Not Found!</p>
      <Link to='/' className='text-green-600  hover:brightness-75'>
        Go Home
     
        </Link>
    </div>
  )
}

export default NotFound
