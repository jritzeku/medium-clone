// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import Main from 'components/container/Main'

import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { createStoryAction } from 'redux/slices/storySlices'
import Editor from 'pages/stories/Editor'
import { TagsInput } from 'components/tag/TagsInput'

import { useHistory } from 'react-router-dom'
import { createDraftAction, editDraftAction } from 'redux/slices/draftSlices'
import showToast from 'utils/showToast'
import Confirm from 'components/confirm/Confirm'
import PreviewImage from 'components/preview_image/PreviewImage'

const formSchema = yup.object().shape({
  title: yup.string().trim().required('Title required'),
  content: yup.string().trim().required('Content is required'),
  image: yup.string().trim().required('Image is required'),
})

const AddStory = ({ draft }) => {
  const dispatch = useDispatch()
  const [storyTags, setStoryTags] = useState([])
  const [showImage, setShowImage] = useState(false)
  const [docType, setDocType] = useState('')
  const [openConfirm, setOpenConfirm] = useState(false)

  let history = useHistory()

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (draft) {
      setStoryTags(draft.tags)
    }
  }, [])

  const yourImage = useRef()

  let storyInitialValues

  if (draft) {
    storyInitialValues = {
      title: draft.title,
      content: draft.content,
      tags: draft.tags,
      image: draft.thumbnailImg,
    }
  } else {
    storyInitialValues = {
      title: '',
      content: '',
      tags: [],
      image: '',
    }
  }

  const formik = useFormik({
    initialValues: storyInitialValues,

    onSubmit: (values) => {
      if (
        formik.values.content.replace(/<(.|\n)*?>/g, '').trim().length === 0
      ) {
        return
      }

      if (draft) {
        values.tags = draft.tags
      } else {
        values.tags = storyTags
      }
 
      const data = {
        title: values?.title,
        content: values?.content,
        tags: values?.tags,
        image: values?.image,
        draftId: draft?._id,
      }

      if (docType === 'draft') {
        if (draft) {
          //edit draft
          dispatch(editDraftAction([draft._id, data]))
        } else {
          //create new draft
          dispatch(createDraftAction(data))
        }

        showToast(
          'Draft was saved. It may take 2-3 minutes for changes to appear.'
        )
      } else if (docType === 'story') {
        dispatch(createStoryAction(data))
        showToast(
          'Story was published.It may take 2-3 minutes for changes to appear.'
        )
      }

      history.push('/me/myStories')
    },
    validationSchema: formSchema,
  })

  return (
    <Main>
      {openConfirm && (
        <Confirm
          title='Delete story'
          msg='Are you sure you want to delete this story?'
          open={openConfirm}
          onClose={() => {
            setOpenConfirm(false)
          }}
          setOpenConfirm={setOpenConfirm}
          handlerFunc={() => history.goBack()}
        />
      )}

      <div className='mt-[100px] my-4 flex flex-col items-center gap-4 mb-12'>
        <p className='font-bold text-xl'>Add new story</p>
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col  items-center justify-center gap-4  mx-auto w-[85%] bg-white p-4 rounded-sm shadow-md'
        >
          <div className='w-full my-4'>
            <label htmlFor='' className='my-4'>
              Include tags relevant to your story{' '}
              <span className='text-[12px] text-gray-600'>
                {' '}
                (separate w/ spacebar)
              </span>
            </label>

            <TagsInput setStoryTags={setStoryTags} storyTags={storyTags} />
          </div>

          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            {draft && (
              <div className='border-2 flex items-center justify-between p-2 gap-4'>
                <span>Current draft thumbnail image: </span>
                <img
                  src={draft?.thumbnailImg}
                  alt=''
                  style={{ width: '40px' }}
                />
              </div>
            )}

            <label
              for='files'
              className=' flex items-center justify-between bg-gray-50 hover:brightness-90 w-full mx-auto border-2 border-dashed p-4 cursor-pointer'
            >
              Select new thumbnail Image
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
              {draft && (
                <img
                  src={draft?.thumbnailImg}
                  alt=''
                  style={{ width: '40px' }}
                />
              )}
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
              Your thumbnail is uploaded: {formik.values?.image?.name}
            </span>

            <div className='text-red-700 mb-2'>
              {formik.touched.image && formik.errors.image}
            </div>
          </div>

          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            <input
              value={formik.values.title}
              onChange={formik.handleChange('title')}
              type='text '
              placeholder='Title'
              className='rounded-sm border-[1px] text-[14px] p-2 w-[100%]'
            />

            <div className='text-red-700 mb-2'>
              {formik.touched.title && formik.errors.title}
            </div>
          </div>

          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            <Editor
              value={formik.values.content}
              onChange={formik.handleChange('content')}
            />
            <div className='text-red-700 mb-2'>
              {formik.touched.content &&
                formik.values.content.replace(/<(.|\n)*?>/g, '').trim()
                  .length === 0 &&
                formik.errors.content}
            </div>
          </div>

          <div className='flex gap-6 items-center'>
            <button
              onClick={() => setDocType('story')}
              name='publishButton'
              onKeyDown={handleKeyDown}
              type='submit'
              style={{ marginTop: '5px' }}
              className='bg-green-700 text-white px-3 py-1 rounded-full hover:brightness-75'
            >
              Publish
            </button>

            <button
              onClick={() => setDocType('draft')}
              name='draftButton'
              type='submit'
              onKeyDown={handleKeyDown}
              style={{ marginTop: '5px' }}
              className='text-green-700 hover:brightness-75'
            >
              Save draft
            </button>
          </div>
        </form>
      </div>
    </Main>
  )
}

export default AddStory

/*


TODO: 

-Customizing the 'Choose file' button text when uploading file 
  ->https://stackoverflow.com/questions/5138719/change-default-text-in-input-type-file
  

  
  <div>
  <label for="files" class="btn">Select Image</label>
  <input id="files" style="visibility:hidden;" type="file">
</div>

-Image preview after uploading 

  ->https://www.youtube.com/watch?v=LA5FvWE2_aM


-disable form submission when pressing 'Enter';  that is for tags


NOTES:

-Validatoin issues
  ->yup validator fails when we enter space bar
      -to fix, i simply added trim() and now works 

  ->for React quill, an empty entry still renders as html markup thus passing validation
      -to prove, simply add a dummy input element for debugging purposes

          <input
            value={formik.values.content}
            onChange={formik.handleChange('content')}
            onBlur={formik.handleBlur('content')}
            type='text '
            placeholder='content'
            className='rounded-sm border-[1px] text-[14px] p-2 w-[100%]'
          />


          
      -to fix i used this regex check: 
      https://stackoverflow.com/questions/52866287/reactquill-validating-empty-input-value-showing-html-tags#:~:text=if(datas.textValue.replace(/%3C(.%7C%5Cn)*%3F%3E/g%2C%20%27%27).trim().length%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20//textarea%20is%20still%20empty%0A%7D

-For confirmation dialog, I had to use web api alert() instead of a custom modal. The alert() 
prevents from going back whereas with custom modal it does NOT. 

-When sending both json data and file, we HAVE to configure it differently!
  ->hence we use FormData() in backend 

-Uploading file using <input type="file"/> insted of  Dropzone?

  ->have to use onChange and set up like this

  <input
    type='file'
    onChange={(e) => {
     formik.setFieldValue('image', e.currentTarget.files[0])
     }}
   />

          
  https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
 
-Tags logic was more complex so had to make separate component 
    ->also we cant just use    onChange={formik.handleChange('tags')} because
    we need to run some logic in TagInput to ensure tag is valid; so cant just do onChange 

    ->when we submit data, before dispatching action, we updated the tags for our form to be
    what was returned by TagInput


-Logic for submitting data is slightly different from registration, since 
we have to upload thumbnail,we need to user FormDatA( ) in our slice


*/
