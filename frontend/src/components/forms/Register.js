// @ts-nocheck
import Modal from 'components/modal/Modal'
import { useFormik } from 'formik'

import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as yup from 'yup'
import { registerUserAction } from '../../redux/slices/userSlices'
import { useDebouncedValidate } from 'hooks/useDebounceValidate'

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/

//form schema
const formSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),

  password: yup.string().min(5).required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

const Register = ({ open, onClose, setOpenLogin }) => {
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validateOnChange: false,
    validationSchema: formSchema,

    onSubmit: (values) => {
      dispatch(registerUserAction(values))
    },
  })

  useDebouncedValidate({
    validate: (values) => {
 
      formik.validateForm(values)
    },
    debounceTime: 200,
    values: formik.values,
  })

 
  const storeData = useSelector((store) => store?.user)
  const { loading, appErr, serverErr, userRegistered } = storeData

  if (userRegistered) {
    return <Redirect to='/profile' />
  }

  return (
    <Modal open={open} onClose={onClose} shadowBottom={true}>
      <img
        onClick={onClose}
        src='/images/close.png'
        alt=''
        style={{ width: '24px' }}
        className=' cursor-pointer ml-[90%]'
      />

      <p className='text-[18px] mb-8 font-serif text-center'>Join Medium.</p>

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
          value={formik.values.firstName}
          onChange={formik.handleChange('firstName')}
          onBlur={formik.handleBlur('firstName')}
          type='text '
          placeholder='First Name'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-700 mb-2'>
          {formik.touched.firstName && formik.errors.firstName}
        </div>

        <input
          value={formik.values.lastName}
          onChange={formik.handleChange('lastName')}
          onBlur={formik.handleBlur('lastName')}
          type='text '
          placeholder='Last Name'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-700 mb-2'>
          {formik.touched.lastName && formik.errors.lastName}
        </div>

        <input
          value={formik.values.email}
          onChange={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          type='text '
          placeholder='email'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-700 mb-2'>
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

        <div className='text-red-700 mb-2'>
          {formik.touched.password && formik.errors.password}
        </div>

        <input
          value={formik.values.confirmPassword}
          onChange={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
          type='password'
          placeholder='confirm password'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-700 mb-2'>
          {formik.touched.confirmPassword && formik.errors.confirmPassword}
        </div>

        <button
          type='submit'
          className='bg-green-700 rounded-full px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90'
        >
          Create account
        </button>
      </form>

      <div className='flex flex-col items-center justify-center gap-5'>
        <p className='text-[12px] text-gray-600'>
          Already have an account ?
          <span
            onClick={() => {
              onClose()
              setOpenLogin(true)
            }}
            className='font-bold text-green-600 cursor-pointer'
          >
            Sign in
          </span>
        </p>

        <p className='text-[10px] text-gray-500 w-[80%]'>
          Click “Sign Up” to agree to Medium’s Terms of Service and acknowledge
          that Medium’s Privacy Policy applies to you.
        </p>
      </div>
    </Modal>
  )
}

export default Register
 