import EditStory from 'components/forms/EditStory'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { getStoryAction } from 'redux/slices/storySlices'

const EditingStory = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  // @ts-ignore
  const storyData = useSelector((state) => state?.story)

  const { storyDetails, loadingStory, appErr, serverErr } = storyData

  useEffect(() => {
    // @ts-ignore
    dispatch(getStoryAction(id))
  }, [dispatch, id])

  return loadingStory ? (
    <div className='flex items-center justify-center '>
      <ClipLoader
        color={'#008000'}
        loading={loadingStory}
        //  cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : appErr || serverErr ? (
    <h1>
      {serverErr} {appErr}
    </h1>
  ) : (
    <EditStory story={storyDetails} />
  )
}

export default EditingStory
