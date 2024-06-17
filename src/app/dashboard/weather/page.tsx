"use client"

import { IWeatherDataList } from '@/(types)/type'
import { getWeatherData } from '@/utils/(apis)/weatherApi'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const page = () => {
  const[data, setData] = useState<IWeatherDataList[]>([])
  const[error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const data = await getWeatherData()
      setData(data)
    } catch (error: any) {
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  if(error) {
    toast.error(error);
}

const HandleDelete = async(id : string) => {
  try {
    const response = await axios.delete(`/api/destination-weather/${id}`)
    if(response.data.success) {
      fetchData();
      return toast.success(response.data.message);
    }else {
      return toast.error(response.data.message);
    }
  }catch(error: any) {
    return toast.error("network error");
  }
}

  return (
    <div className="flex flex-col">
      <div className="">
        {data.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p>no available data</p>
          </div>
        ): (
          <table className='border-collapse'>
            <thead>
              <tr>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Destination</th>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Date</th>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Air Temperature</th>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Water Temperature</th>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Humidity</th>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Condition</th>
                <th className='border border-slate-600 px-[20px] py-[15px]'>Sunny Hours</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <React.Fragment key={d._id}>
                  <tr>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.destinationId}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.date}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.airTemperature}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.waterTemperature}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.humidity}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.condition}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>{d.sunnyHours}</td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>
                      <button>Edit</button>
                    </td>
                    <td className='border border-slate-600 px-[20px] py-[15px] '>
                      <button
                      onClick={() => HandleDelete(d._id)}
                      >Delete</button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default page