// @ts-nocheck
import Content from 'components/container/Content'
import Main from 'components/container/Main'
import { useEffect, useState } from 'react'

import Chart from 'components/graph/Chart'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import {
  getMyClappedStoriesAction,
  getMyReadStoriesAction,
  getMyViewedStoriesAction,
} from 'redux/slices/storySlices'

const Stats = () => {
  const [topics, setTopics] = useState(['Reads', 'Views', 'Claps'])
  const [activeSection, setActiveSection] = useState('Views')

  const dispatch = useDispatch()

  const story = useSelector((state) => state?.story)

  const {
    storiesRead,
    storiesViewed,
    storiesClapped,
    loading,
    appErr,
    serverErr,
  } = story

  const [chartData, setChartData] = useState(storiesRead)

  const [highestViews, setHighestViews] = useState(0)

  const [highestReads, setHighestReads] = useState(0)

  const [highestClaps, setHighestClaps] = useState(0)

  const user = useSelector((state) => state?.user)
  const { userAuth } = user

  const [month, setMonth] = useState(
    new Intl.DateTimeFormat('en-US')
      .format(new Date(userAuth?.createdDate?.toString()))
      .toString()
      .split('/')
      .join('-')
  )

  useEffect(() => {
    dispatch(getMyReadStoriesAction(month))

    dispatch(getMyViewedStoriesAction(month))

    dispatch(getMyClappedStoriesAction(month))
  }, [month])

  const setPrevMonthHandler = () => {
    let currDate = new Intl.DateTimeFormat('en-US').format(
      new Date(new Date(month).getFullYear(), new Date(month).getMonth() - 1, 1)
    )

    currDate = currDate.split('/').join('-')

    setMonth(currDate)
  }

  const setNextMonthHandler = () => {
    let currDate = new Intl.DateTimeFormat('en-US').format(
      new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 1)
    )

    currDate = currDate.split('/').join('-')

    setMonth(currDate)
  }

  const setFirstMonthHandler = () => {
    //set to when user first created account
 

    let date = new Date(userAuth?.createdDate)

    let month = date.getUTCMonth() + 1 //months from 1-12
    let day = date.getUTCDate()
    let year = date.getUTCFullYear()

    let currDate = `${month}-${day}-${year}`

    setMonth(currDate)
  }

  const setLastMonthHandler = () => {
    let date = new Date()

    let month = date.getUTCMonth() + 1 //months from 1-12
    let day = date.getUTCDate()
    let year = date.getUTCFullYear()

    let currDate = `${month}-${day}-${year}`

    setMonth(currDate)
  }

  return loading ? (
    <div className='flex items-center justify-center mt-[100px] '>
      <ClipLoader
        color={'#008000'}
        loading={loading}
        //  cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : appErr || serverErr ? (
    <h2 className='text-yellow-400 text-2xl'>
      {serverErr} {appErr}
    </h2>
  ) : (
    <Main>
      <Content>
        <div className='flex flex-col gap-12'>
          <div className='border-b-[1px] pb-4 mb-4'>
            <p className='text-2xl font-bold'>Your stats</p>
          </div>

          <div className='flex items-center justify-between '>
            {/* Views */}
            <div
              className='border-r-[1px] w-[30%] cursor-pointer '
              onClick={() => setActiveSection('Views')}
            >
              <div className={activeSection !== 'Views' && 'opacity-20'}>
                <p className='text-2xl font-extrabold '>
                  {storiesViewed?.reduce((acc, r) => r.viewsCount + acc, 0)}
                </p>
                <p className='text-[14px] font-extrabold'>
                  Views <span className='font-thin'>(30 days)</span>
                </p>
              </div>
            </div>

            {/* Reads */}
            <div
              className='border-r-[1px] w-[30%] cursor-pointer'
              onClick={() => setActiveSection('Reads')}
            >
              <div className={activeSection !== 'Reads' && 'opacity-20'}>
                <p className='text-2xl font-extrabold'>
                  {storiesRead?.reduce((acc, r) => r.readsCount + acc, 0)}
                </p>
                <p className='text-[14px] font-extrabold'>
                  Reads <span className='font-thin'>(30 days)</span>
                </p>
              </div>
            </div>

            {/* Claps */}
            <div
              className='w-[30%]  cursor-pointer'
              onClick={() => setActiveSection('Claps')}
            >
              <div className={activeSection !== 'Claps' && 'opacity-20'}>
                {/* Fans represents number of unique readers that clapped for story */}
                <p className='text-2xl font-extrabold'>
                  {storiesClapped?.reduce((acc, r) => r.clapsByUser + acc, 0)}
                </p>
                <p className='text-[14px] font-extrabold'>
                  Claps <span className='font-thin'>(30 days)</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <div>
              {activeSection === 'Reads' ? (
                <Chart data={storiesRead} month={month} dKey='readsCount' />
              ) : activeSection === 'Views' ? (
                <Chart data={storiesViewed} month={month} dKey='viewsCount' />
              ) : (
                <Chart data={storiesClapped} month={month} dKey='clapsByUser' />
              )}
            </div>

            <div className='  flex flex-col items-center gap-2  border-[1px] py-2 mb-8 mt-2'>
              <div className='flex items-center gap-2 text-gray-600  cursor-pointer hover:brightness-75'>
                <span onClick={setFirstMonthHandler}>First Month</span>
              </div>

              {storiesViewed &&
                (new Date(userAuth?.createdDate?.toString()) >=
                new Date(storiesViewed[0]?.createdDate?.toString()) ? (
                  <>
                    <div className='flex items-center gap-2 text-gray-400 '>
                      <FaAngleLeft size={12} />
                      <span>Previous 30 days</span>
                    </div>
                  </>
                ) : (
                  <div className='flex items-center gap-2 text-gray-600  cursor-pointer hover:brightness-75'>
                    <FaAngleLeft size={12} />
                    <span onClick={setPrevMonthHandler}>Previous 30 days</span>
                  </div>
                ))}

              {new Date(
                new Date(month).getFullYear(),
                new Date(month).getMonth() + 1,
                0
              ) >= new Date(Date.now()) ? (
                <div className='flex items-center gap-2 text-gray-400 '>
                  <FaAngleRight size={12} />
                  <span>Next 30 days</span>
                </div>
              ) : (
                <div className='flex items-center gap-2 text-gray-600  cursor-pointer hover:brightness-75'>
                  <span onClick={setNextMonthHandler}>Next 30 days</span>
                  <FaAngleRight size={12} />
                </div>
              )}

              <div className='flex items-center gap-2 text-gray-600  cursor-pointer hover:brightness-75'>
                <span onClick={setLastMonthHandler}>Last Month</span>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Main>
  )
}

export default Stats

/*
NOTES: 

-WARNING: Firefox issue with date... 
  https://stackoverflow.com/questions/63958875/why-do-i-get-rangeerror-date-value-is-not-finite-in-datetimeformat-format-w

-Does useEffect run BEFORE the code in return/render section of component?
  ->'it runs after the first render and each subsequent render.'


https://stackoverflow.com/questions/55424405/does-a-render-happen-before-function-in-react-hooks-useeffect-is-called

-Set state in useEffect?


https://stackoverflow.com/questions/53715465/can-i-set-state-inside-a-useeffect-hook
*/
