import Login from 'components/forms/Login'
import Register from 'components/forms/Register'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const PublicNavbar = () => {
  const [headerBgColor, setHeaderBgColor] = useState('bg-amber-400')
  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  const listenScrollEvent = (event) => {
    if (window.scrollY < 400) {
      setHeaderBgColor('bg-amber-400')
    } else if (window.scrollY > 400) {
      setHeaderBgColor('bg-white')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)

    //clean up
    return () => window.removeEventListener('scroll', listenScrollEvent)
  }, [])

  return (
    <nav
      id='nav'
      className={`border-b-[1px] border-gray-800 h-16 w-full fixed top-0 z-10 py-2  flex justify-center ${headerBgColor}`}
    >
      <div className='w-[80%] flex justify-between'>
        <Link to='/'>
          <div className='flex items-center justify-center'>
            <img src='/images/logo.png' alt='' style={{ width: '40px' }} />

            <span className='text-[24px] pl-[6px] '>Medium</span>
          </div>
        </Link>

        <ul className='flex items-center gap-6 text-[12px]'>
          <li id='login' className='cursor-pointer '>
            <p onClick={() => setOpenLogin(true)}>Sign in</p>

            {openLogin && (
              <Login
                open={openLogin}
                onClose={() => setOpenLogin(false)}
                setOpenRegister={setOpenRegister}
              />
            )}
          </li>

          <li
            id='register'
            className='cursor-pointer py-2 px-3 bg-black rounded-full showModal hover:brightness-90'
          >
            <p onClick={() => setOpenRegister(true)} className='text-white '>
              Get Started
            </p>

            {openRegister && (
              <Register
                open={openRegister}
                onClose={() => setOpenRegister(false)}
                setOpenLogin={setOpenLogin}
              />
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default PublicNavbar
