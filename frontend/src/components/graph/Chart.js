 
import moment from 'moment'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs'

const Chart = ({ data, month, dKey }) => {
  //NOTE: re-chart js automatically uses the highest value as max instead of
  //our local state if the state value is too small
  const [maxY, setMaxY] = useState(40)

  const formatDate = (tickItem) => {
    return moment(tickItem).format('M/D')
  }

  return (
    <div className='flex items-center justify-center '>
      <div className='flex flex-col items-center text-center justify-center gap-3'>
        <div
          onClick={() => setMaxY((prevVal) => prevVal + 5)}
          className='cursor-pointer'
        >
          <BsFillCaretUpFill />
        </div>
        <div className='w-[120px]'>
          <p>Adjust Y-max</p>

          

          <p className='text-[12px] text-gray-600 my-2 text-center'>
            NOTE: Y-max can not be smaller than the highest stat value on  graph
          </p>
        </div>
        <div
          onClick={() => setMaxY((prevVal) => prevVal - 5)}
          className='cursor-pointer'
        >
          <BsFillCaretDownFill />
        </div>
      </div>

      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray='3 3'></CartesianGrid>
          <XAxis
      
            dataKey='createdDate'
            tickLine={false}
            tickFormatter={formatDate}
          />
          <YAxis allowDecimals={false} domain={[0, maxY]} />
          <Tooltip />
          <Legend />

          <Bar dataKey={`${dKey}`} fill='#82ca9d' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart

 