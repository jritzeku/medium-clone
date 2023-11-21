import Content from 'components/container/Content'
import Main from 'components/container/Main'
import NotificationList from 'components/notification/NotificationList'
import SliderTab from 'components/slider-tab/SliderTab'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from 'redux/slices/notificationSlices'

const Notifications = () => {
  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const notification = useSelector((state) => state?.notification)
  const {
    notifications,
    loading,
    appErr,
    serverErr,
    newNotification,
    allNotificationsRead,
    notificationRead,
    notificationEdited,
  } = notification

  const defaultTopic = 'All'
  const [activeSection, setActiveSection] = useState(defaultTopic)

  const [topics, setTopics] = useState(['All', 'Comments', 'Follows', 'Claps'])

  useEffect(() => {
    dispatch(getNotificationsAction(userAuth?._id))
  }, [
    newNotification,
    allNotificationsRead,
    notificationRead,
    notificationEdited,
  ])

  const dispatch = useDispatch()

  const markNotificationReadHandler = (id) => {
    dispatch(markNotificationReadAction(id))
  }

  const markAllNotificationsReadHandler = () => {
    dispatch(markAllNotificationsReadAction(userAuth?._id))
  }

  return (
    <Main>
      <Content>
        <div>
          <div className='flex justify-between items-center  '>
            <p className='text-[32px] mb-4'>Your Notifications</p>
          </div>

          <SliderTab
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            topics={topics}
            defaultSection={'Your lists'}
          />
        </div>

        {appErr || serverErr ? (
          <h1>
            {serverErr} {serverErr}
          </h1>
        ) : (
          <>
            <NotificationList
              activeSection={activeSection}
              notifications={
                activeSection !== 'All'
                  ? notifications.filter(
                      (n) =>
                        n.resourceType ===
                        activeSection
                          .substring(0, activeSection.length - 1)
                          .toLowerCase()
                    )
                  : notifications
              }
              markNotificationReadHandler={markNotificationReadHandler}
            />

            {notifications?.filter((n) => n.wasRead === false)?.length > 0 && (
              <p
                onClick={markAllNotificationsReadHandler}
                className='text-green-700 px-4 cursor-pointer hover:brightness-75 '
              >
                Mark all as read
              </p>
            )}
          </>
        )}
      </Content>
    </Main>
  )
}

export default Notifications