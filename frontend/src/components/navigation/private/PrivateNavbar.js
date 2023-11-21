// @ts-nocheck
import SearchBox from 'components/search-box/SearchBox'
import { useEffect, useReducer, useState } from 'react'
import { BsBarChart, BsBookmarks } from 'react-icons/bs'
import { GoBook } from 'react-icons/go'
import { RxPerson } from 'react-icons/rx'
import { TfiAngleDown, TfiPencilAlt } from 'react-icons/tfi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { getLoggedInUserAction, logoutAction } from 'redux/slices/userSlices'

import Notification from 'components/notification/Notification'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from 'redux/slices/notificationSlices'
import useComponentVisible from 'hooks/useComponentVisible'

const PrivateNavbar = () => {
  useEffect(() => {}, [])

  const notification = useSelector((state) => state?.notification)
  const {
    notifications,
    newNotification,
    allNotificationsRead,
    notificationRead,
    notificationEdited,
  } = notification

  const {
    ref: notificationsDropdown,
    isComponentVisible: isNotificationsDropdownVisible,
    setIsComponentVisible: setIsNotificationsDropdownVisible,
  } = useComponentVisible(false)

  const {
    ref: userMenuDropdown,
    isComponentVisible: isUserMenuDropdownVisible,
    setIsComponentVisible: setIsUserMenuDropdownVisible,
  } = useComponentVisible(false)

  const dispatch = useDispatch()
  const history = useHistory()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showNavDropdown, setShowNavDropdown] = useState(false)

  const user = useSelector((state) => state?.user)
  const { loggedInUserDetails, userEdited, userAuth } = user

  useEffect(() => {
    dispatch(getLoggedInUserAction(userAuth?._id))
    dispatch(getNotificationsAction(userAuth?._id))
  }, [
    newNotification,
    allNotificationsRead,
    notificationRead,
    notificationEdited,
    userEdited,
  ])

  //needs to be in separate useEffect or else infinite render
  useEffect(() => {}, [notifications])

  const logout = () => {
    dispatch(logoutAction())
    history.push('/')
  }
  const markNotificationReadHandler = (id) => {
    dispatch(markNotificationReadAction(id))
  }

  const markAllNotificationsRead = () => {
    dispatch(markAllNotificationsReadAction(userAuth?._id))
  }

  return (
    <nav
      id='nav'
      className='bg-white border-b-[1px] border-gray-300 h-16 top-0 z-10 py-2 fixed w-full flex justify-center'
    >
      <div className='w-[90%] flex justify-between'>
        <div className=' flex items-center justify-center'>
          <div
            onClick={() => {
              setShowNavDropdown(false)
              setShowNotifications(false)
            }}
          >
            <Link to='/'>
              <img
                src='/images/logo.png'
                alt=''
                className='pr-4  hidden md:block'
                style={{ width: '40px' }}
              />
            </Link>
          </div>

          <SearchBox />
        </div>

        <ul className='flex items-center gap-6 text-[12px]'>
          <li
            id='write-story'
            className='cursor-pointer text-gray-500 lg:block   '
          >
            <Link to='/newStory'>
              <TfiPencilAlt size={20} />
            </Link>
            <ReactTooltip
              //Disregard deprecation warning;  tried non-deprecated options but they dont work
              anchorId='write-story'
              place='bottom'
              content='Write a story'
            />
          </li>

          <li
            ref={notificationsDropdown}
            onClick={() => {
              setIsNotificationsDropdownVisible((prevVal) => !prevVal)
            }}
            id='notifications'
            className='cursor-pointer text-gray-500 bg-white z-10  lg:block selection: relative'
          >
            <div className='relative flex flex-col items-center  '>
              <div>
                <IoMdNotificationsOutline size={20} />
                <ReactTooltip
                  //Disregard deprecation warning;  tried non-deprecated options but they dont work
                  anchorId='notifications'
                  place='bottom'
                  content='Notifications'
                />

                {/* notification bell  */}
                {notifications?.filter((n) => n.wasRead === false).length >
                  0 && (
                  <div className='absolute p-0 top-[-6px] left-[10px] bg-red-600 text-white  text-[10px]  w-[15px] h-[15px] rounded-full'>
                    <span className='flex items-center justify-center p-0'>
                      {notifications?.filter((n) => n.wasRead === false).length}
                    </span>
                  </div>
                )}
              </div>

              {/* notification dropdown  */}

              {isNotificationsDropdownVisible && (
                <ul className='  absolute overflow-hidden px-4 py-1 top-[10px] flex flex-col  gap-2   text-[12px] text-gray-500 bg-white mt-2      border-[1px] rounded-md shadow-md group-hover:flex'>
                  <div className='sm:w-[200px] md:w-[300px]'>
                    <p className='py-3 text-black text-[14px] font-bold  text-center border-b-[1px] mb-2 '>
                      Latest notifications
                    </p>

                    {notifications.length === 0 ? (
                      <p> No notifications exists</p>
                    ) : (
                      notifications?.slice(0, 3).map((notification, index) => (
                        <div key={index}>
                          <li className='w-[220px]'>
                            <Notification
                              notification={notification}
                              markNotificationReadHandler={
                                markNotificationReadHandler
                              }
                              isPreview={true}
                            />
                          </li>

                          <hr className='mb-1' />
                        </div>
                      ))
                    )}

                    {notifications?.length > 0 && (
                      <li className=' flex items-center   justify-between'>
                        <span
                          onClick={markAllNotificationsRead}
                          className='text-green-700'
                        >
                          Mark all as read
                        </span>

                        <Link
                          to={`/notifications`}
                          className=' flex items-center gap-4 hover:brightness-50'
                        >
                          <span className=' font-bold'>See all</span>
                        </Link>
                      </li>
                    )}
                  </div>
                </ul>
              )}
            </div>
          </li>

          <li
            ref={userMenuDropdown}
            onClick={() => {
              setIsUserMenuDropdownVisible((prevVal) => !prevVal)
            }}
            className='cursor-pointer py-2 px-3'
          >
            <div className='relative flex flex-col items-center  '>
              <div className='flex items-center gap-1'>
                <img
                  src={loggedInUserDetails?.image}
                  alt=''
                  style={{ width: '25px' }}
                  className='rounded-full'
                />
                <TfiAngleDown
                  size={10}
                  className='fas fa-angle-down text-gray-500 font-weight-[2px] hover: brightness-75'
                />
              </div>

              {isUserMenuDropdownVisible && (
                <ul className=' absolute top-[10px] bg-white z-10  flex flex-col  gap-2 justify-center  text-[12px] text-gray-500 bg-white mt-2 p-4   w-[250px] border-[1px] rounded-md shadow-md group-hover:flex'>
                  <li>
                    <Link
                      to={`/profile/${userAuth?._id}`}
                      className='flex items-center gap-4 hover:brightness-50'
                    >
                      <RxPerson />
                      <span>Profile</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/me/library`}
                      className='flex items-center gap-4 hover:brightness-50'
                    >
                      <BsBookmarks />
                      <span>Library</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/me/myStories`}
                      className='flex items-center gap-4 hover:brightness-50'
                    >
                      <GoBook />
                      <span>My Stories</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/me/stats`}
                      className='flex items-center gap-4 hover:brightness-50'
                    >
                      <BsBarChart />
                      <span>Stats</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/refineRecommendations`}
                      className='flex items-center gap-4 hover:brightness-50'
                    >
                      <span>Refine Recommendations</span>
                    </Link>
                  </li>

                  <li className='pt-4 border-t-[1px] flex flex-col justify-center'>
                    <span
                      onClick={logout}
                      className='hover:brightness-50 text-left'
                    >
                      Sign out
                    </span>

                    <span className='text-gray-500'>{userAuth?.email}</span>
                  </li>
                </ul>
              )}
            </div>
          </li>

          <li className='hidden md:block text-gray-800'>
            <p>
              Welcome back <br />
              {userAuth?.email}
            </p>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default PrivateNavbar
