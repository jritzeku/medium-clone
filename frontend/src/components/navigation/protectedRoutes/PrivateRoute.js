

// @ts-nocheck
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
 
const user = useSelector((state) => state?.user)
  const { userAuth } = user
 
  return (
   
    <Route
      {...rest}
      render={() =>
        userAuth ? <Component {...rest} /> : <Redirect to='/' />
      }
    />
  )
}

export default PrivateRoute

 