// @ts-nocheck

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PublicNavbar from './public/PublicNavbar'
import PrivateNavbar from './private/PrivateNavbar'

const Navbar = () => {
  const user = useSelector((state) => state?.user)

  const storeData = useSelector((store) => store?.user)
  const { userAuth } = storeData

  return userAuth ? <PrivateNavbar /> : <PublicNavbar />
}

export default Navbar
