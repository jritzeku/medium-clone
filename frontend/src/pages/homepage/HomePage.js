// @ts-nocheck
import Guest from 'components/home/Guest'
import Member from 'components/home/Member'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAction } from 'redux/slices/userSlices'
import { connectWithSocketServer } from '../../realtimeCommunication/socketConnection'

const HomePage = ({ match }) => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state?.user)
  const { userAuth, userDetails, loadingUser, appErrUser, serverErrUser } = user

  useEffect(() => {
    if (userAuth) {
      dispatch(getUserAction(userAuth?._id))

      connectWithSocketServer(userAuth)
    }
  }, [userAuth])

  return (
 
    <div>
      {appErrUser || serverErrUser ? (
        <h1>
          {serverErrUser} {appErrUser}
        </h1>
      ) : userAuth && userDetails ? (
        <Member userDetails={userDetails} />
      ) : !userAuth ? (
        <Guest />
      ) : (
        <></>
      )}
    </div>
  )
}

export default HomePage
 