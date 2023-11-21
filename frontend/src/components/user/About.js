 
import EditProfile from 'components/forms/EditProfile'
 
import React from 'react'
import DateFormatter from 'utils/DateFormatter'

const About = ({ userDetails, openEdit, setOpenEdit }) => {
  return (
    <>
      <div>
        {userDetails?.aboutMe === '' ? (
          <>
            <p>About me section is not yet set.</p>
            <p
              onClick={() => setOpenEdit(true)}
              className=' py-2 text-green-600 cursor-pointer  hover:brightness-75'
            >
              Start here
            </p>
          </>
        ) : (
          <p className='text-[12px] font-serif text-gray-700'>
            {userDetails?.aboutMe}
          </p>
        )}
      </div>

      <hr className='my-8' />

      <div className='flex flex-col gap-4'>
        <div className='flex gap-1 items-center text-[11px] text-gray-500'>
          <p>
            Medium member since <DateFormatter date={userDetails?.createdAt} />
          </p>
        </div>

        <div className='flex gap-1 items-center text-[11px] text-green-700'>
          <p>{userDetails?.followers.length} Followers</p>

          <p>&#xb7;</p>
          <div>
            <p> Following {userDetails?.following.length} </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default About


