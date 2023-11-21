import Notification from 'components/notification/Notification'
import { useState } from 'react'

const NotificationsList = ({
  notifications,
  markNotificationReadHandler,
  activeSection,
}) => {
  const [visible, setVisible] = useState(10)

  const showMorePosts = () => {
    setVisible((prevValue) => prevValue + 10)
  }

  return (
    <div className='overflow-scroll '>
      <ul className='flex flex-col justify-center gap-8 mb-5 overflow-scroll py-3'>
        {notifications?.length === 0 ? (
          activeSection === 'All' ? (
            <p>No notifications exist </p>
          ) : (
            <p>No {activeSection.toLowerCase()} notifications exist </p>
          )
        ) : (
          notifications?.slice(0, visible).map((notification, index) => (
            <li 
            key={index}
            className='py-4 border-b-[1px]'>
              <Notification
                notification={notification}
                markNotificationReadHandler={markNotificationReadHandler}
              />
            </li>
          ))
        )}

   

        {visible < notifications?.length && (
          <button
            onClick={showMorePosts}
            className='mx-auto w-full cursor-pointer border-2'
          >
            Show more
          </button>
        )}
      </ul>
    </div>
  )
}

export default NotificationsList
