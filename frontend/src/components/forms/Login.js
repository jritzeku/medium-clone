
// @ts-nocheck
import Modal from 'components/modal/Modal'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'

import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as yup from 'yup'
import { loginUserAction } from '../../redux/slices/userSlices'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const formSchema = yup.object({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})

const Login = ({ open, onClose, setOpenRegister }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  })

  const submitForm = (data) => {
    dispatch(loginUserAction(data))
    history.push('/')
  }

  const store = useSelector((state) => state?.user)

  const { userAuth, loading, serverErr, appErr } = store

  if (userAuth) return <Redirect to={`/profile/${userAuth?._id}`} />

  
  return (
    <Modal open={open} onClose={onClose} shadowBottom={true}>
      <img
        onClick={onClose}
        src='/images/close.png'
        alt=''
        style={{ width: '24px' }}
        className=' cursor-pointer ml-[90%]'
      />

      <p className='text-[18px] mb-8 font-serif text-center'>Welcome back.</p>

      <form
        onSubmit={handleSubmit(submitForm)}
        className='flex flex-col items-center justify-center gap-5 bg-white w-[400px] py-8'
      >
        {appErr || serverErr ? (
          <div className='text-red-700'>
            {serverErr} {appErr}
          </div>
        ) : null}

        <input
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
          type='text'
          placeholder='Email'
          {...register('email')}
        />
        <p>{errors.email?.message}</p>

        <input
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
          type='password'
          placeholder='Password'
          {...register('password')}
        />
        <p>{errors.password?.message}</p>

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

 