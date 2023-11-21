import Login from 'components/forms/Login'
import Register from 'components/forms/Register'
import React, { useState } from 'react'

const Hero = () => {
  const [openLogin, setOpenLogin] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)

  return (
    <>
      {openRegister && (
        <Register
          open={openRegister}
          onClose={() => setOpenRegister(false)}
          setOpenLogin={setOpenLogin}
        />
      )}

      {openLogin && (
        <Login
          open={openLogin}
          onClose={() => setOpenLogin(false)}
          setOpenRegister={setOpenRegister}
        />
      )}
      <div
        id='hero'
        className='gap-8 h-96 bg-amber-400 flex justify-center items-center'
      >
        <div className='flex flex-col items-center justify-center gap-8 w-[80%] sm:w-[90%] text-center'>
          <p className='text-8xl'>Stay Curious.</p>

          <p className='text-xl'>
            Discover stories, thinking, and expertise from writers on any topic.
          </p>

          <span className='cursor-pointer py-2 px-6 bg-black rounded-full'>
            <p
              onClick={() => setOpenRegister(true)}
              className='text-white text-lg'
            >
              Start reading
            </p>
          </span>
        </div>
      </div>
    </>
  )
}

export default Hero
