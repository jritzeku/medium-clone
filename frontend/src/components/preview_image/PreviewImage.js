import React, { useState } from 'react'

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null)

 

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    setPreview(reader.result)
  }
  return (
    <div>
      <img src={preview} alt='preview' className='w-[100px] h-[100px]' />
    </div>
  )
}

export default PreviewImage

/*
NOTES:

SourcE: https://www.youtube.com/watch?v=LA5FvWE2_aM

-FileReader 
    ->Lets web applications asynchronously read the contents of files
     (or raw data buffers) stored on the user's computer, using File or
      Blob objects to specify the file or data to read.



*/
