 
import { toast } from 'react-toastify'

const showToast = (msg) => {
  return toast(msg, {
    toastId: msg,
    position: 'top-center',
    autoClose: 1500,
    hideProgressBar: true,
    progress: 0,
    theme: 'dark',
  })
}

export default showToast

/*
NOTES: 

-Prevent multiple toasts from showing 
  ->simply add the 'toastId'
https://fkhadra.github.io/react-toastify/prevent-duplicate/



*/
