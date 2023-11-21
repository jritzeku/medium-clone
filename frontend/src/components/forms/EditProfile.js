// @ts-nocheck
import Modal from 'components/modal/Modal'
import React, { useRef, useState } from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { editUserAction } from '../../redux/slices/userSlices'
import PreviewImage from 'components/preview_image/PreviewImage'

const formSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
})

const EditProfile = ({ id, open, onClose, setOpenEdit }) => {
  const dispatch = useDispatch()
  const [showImage, setShowImage] = useState(false)
  const yourImage = useRef()


  const storeData = useSelector((store) => store?.user)
  const { loading, appErr, serverErr, userDetails } = storeData

  const formik = useFormik({
    enableReinitialize: true, //necessary??

    initialValues: {
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      blurb: userDetails?.blurb,
      aboutMe: userDetails?.aboutMe,

      image: userDetails?.image,
    },

    onSubmit: (values) => {
      const editedData = {
        firstName: values?.firstName,
        lastName: values?.lastName,
        blurb: values?.blurb,
        aboutMe: values?.aboutMe,
        image: values?.image,
      }

      dispatch(editUserAction([id, editedData]))

      onClose()
    },
    validationSchema: formSchema,
  })

  return (
    <Modal width={'500px'} open={open} onClose={onClose} shadowBottom={true}>
      <img
        onClick={onClose}
        src='/images/close.png'
        alt=''
        style={{ width: '24px' }}
        className='cursor-pointer ml-[90%] mt-4'
      />

      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-col items-center justify-center gap-5 bg-white   py-8'
      >
        <div className='border-2 flex items-center justify-between p-2 gap-4'>
          <span>Current profile image: </span>
          <img src={userDetails?.image} alt='' style={{ width: '40px' }} />
        </div>

        <label
          for='files'
          className='px-2 flex items-center justify-between bg-gray-50 hover:brightness-90 w-full mx-auto border-2 border-dashed p-2 cursor-pointer'
        >
          Select new profile image
          <input
            id='files'
            type='file'
            className='hidden'
            accept='image/jpeg, image/png'
            onChange={(e) => {
              setShowImage(true)

              formik.setFieldValue('image', e.currentTarget.files[0])
            }}
          />
          {formik.values.image && showImage && (
            <PreviewImage file={formik.values?.image} />
          )}
        </label>
        <span
          ref={yourImage}
          className={`${
            showImage ? 'block' : 'hidden'
          } text-gray-600 text-[12px]`}
        >
          Your profile image uploaded: {formik.values?.image?.name}
        </span>

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
          value={formik.values.blurb}
          onChange={formik.handleChange('blurb')}
          onBlur={formik.handleBlur('blurb')}
          type='text '
          placeholder='A short blurb about yourself'
          className='text-white bg-gray-700 border-[1px] text-[10px] p-2 w-[60%] rounded-sm text-center'
        />

        <div className='text-red-700'>
          {formik.touched.blurb && formik.errors.blurb}
        </div>

        <div className='flex items-center w-[300px] my-4'>
          <textarea
            value={formik.values.aboutMe}
            onChange={formik.handleChange('aboutMe')}
            onBlur={formik.handleBlur('aboutMe')}
            rows='5'
            cols='10'
            placeholder='Tell us about yourself'
            className='px-2 mx-auto appearance-none block w-full py-3 text-base leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none'
            type='text'
          ></textarea>

          <div className='text-red-700'>
            {formik.touched.aboutMe && formik.errors.aboutMe}
          </div>
        </div>

        <button
          type='submit'
          className='bg-green-700 rounded-full px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90'
        >
          Edit profile
        </button>
      </form>
    </Modal>
  )
}

export default EditProfile
 