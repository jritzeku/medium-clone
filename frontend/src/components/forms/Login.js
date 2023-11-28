// @ts-nocheck
import Modal from 'components/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Link, Route, useHistory } from 'react-router-dom'

// import { Navigate, redirect, useNavigate } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { loginUserAction } from '../../redux/slices/userSlices'

const formSchema = yup.object({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})

const Login = ({ open, onClose, setOpenRegister }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      // @ts-ignore
      dispatch(loginUserAction(values))
      history.push('/')
    },
  })

  // @ts-ignore
  const store = useSelector((state) => state?.user)

  const { userAuth, loading, serverErr, appErr } = store

  if (userAuth) return <Redirect to={`/profile/${userAuth?._id}`} />

  return (
    <Modal open={open} onClose={onClose}>
      <img
        onClick={onClose}
        src='/images/close.png'
        alt=''
        style={{ width: '24px' }}
        className=' cursor-pointer ml-[90%]'
      />

      <p className='text-[18px] mb-8 font-serif text-center'>Welcome back.</p>

      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-col items-center justify-center gap-5 bg-white w-[400px] py-8'
      >
        {appErr || serverErr ? (
          <div className='text-red-400'>
            {serverErr} {appErr}
          </div>
        ) : null}

        <input
          value={formik.values.email}
          onChange={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          type='text '
          placeholder='email'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />
        <div className='text-red-400 mb-2'>
          {formik.touched.email && formik.errors.email}
        </div>

        <input
          value={formik.values.password}
          onChange={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          type='password'
          placeholder='password'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-400 mb-2'>
          {formik.touched.password && formik.errors.password}
        </div>

        <button
          type='submit'
          className='bg-green-700 rounded-full px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90'
        >
          Sign in
        </button>
      </form>

      <div className='flex flex-col items-center justify-center gap-5'>
        <p className='text-[12px] text-gray-600'>
          No account ?
          <span
            onClick={() => {
              onClose()
              setOpenRegister(true)
            }}
            className='font-bold text-green-600 cursor-pointer'
          >
            Create one
          </span>
        </p>
      </div>
    </Modal>
  )
}

export default Login

/*

-BUG: 

Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

    ->for me, it seems issue is with useNavigatE() 

        https://stackoverflow.com/questions/70818978/maximum-update-depth-exceeded-from-navigate-component-react-router-dom-v6

https://typeofnan.dev/fix-the-maximum-update-depth-exceeded-error-in-react/

    ->I ended up using React router v5 and reverting back to <Redirect/> and works now with no bug



*/
