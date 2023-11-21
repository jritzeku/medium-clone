import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'
import { truncate } from 'utils/truncate'

const Notification = ({
  notification,
  markNotificationReadHandler,
  isPreview = false,
}) => {
  const [resourcePath, setResourcePath] = useState('')

  useEffect(() => {
    if (notification.resourceType === 'clap') {
      setResourcePath(
        `/storyDetails/${notification?.resource?.story?.toString()}`
      )
    } else if (notification.resourceType === 'comment') {
      setResourcePath(
        `/storyDetails/${notification?.resource?.storyId?.toString()}/${
          notification.resourceId
        }`
      )
    } else if (notification.resourceType === 'follow') {
      setResourcePath(`/profile/${notification?.user?._id.toString()}`)
    }
  }, [resourcePath])

  return (
    <Link to={resourcePath}>
      <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 '>
        <div className='hidden md:block'>
          <img
            src={notification?.user?.image}
            style={{ width: '40px', height: '40 px' }}
            alt=''
            className='rounded-full'
          />
        </div>

        <div className='ml-4   rounded w-full'>
          <div>
            <span className='text-gray-800'> {notification.description} </span>
            <br />

            {notification.resourceType === 'comment' &&
              (isPreview ? (
                <p className='text-gray-600'>
                  "{truncate(notification?.resource?.content, 20)} "
                </p>
              ) : (
                <p className='my-4 border-[1px] py-4 px-2 text-gray-600'>
                  "{notification.resource?.content}"
                </p>
              ))}
          </div>

          <div className='flex items-center gap-4 pt-4'>
            <p>
              <ReactTimeAgo
                date={new Date(notification.createdAt)}
                locale='en-US'
                timeStyle='round-minute'
              />
            </p>

            {notification.wasRead === false ? (
              <p
                onClick={() => markNotificationReadHandler(notification?._id)}
                className='text-[12px] text-green-700   pl-2 cursor-pointer hover:brightness-75 '
              >
                Mark as read
              </p>
            ) : (
              <p className='text-[12px] text-gray-600  pl-2  cursor-pointer hover:brightness-75 '>
                Already read
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Notification
