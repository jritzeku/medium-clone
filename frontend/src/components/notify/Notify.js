import React from 'react'

import { toast } from 'react-toastify'

const Notify = () => {
  return toast('List has been saved', {
    position: 'top-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: 'dark',
  })
}

export default Notify
