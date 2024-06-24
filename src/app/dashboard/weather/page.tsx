"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


const page = () => {
    const[weatherData, setWeatherData] = useState<any[]>([])

    const FetchData = async() => {
        try {
            const response = await axios('/api/weather')
            if(response.data.success) {
                setWeatherData(response.data.data)
            }else {
                return toast.error(response.data.message)
            }
        }catch(error) {
            return toast.error("network error")
        }
    }
    useEffect(() => {
        FetchData()
    }, [])

    console.log(weatherData);

  return (
    <div className="flex flex-col">
        <div className="">
            <table>
                <thead>
                    <tr>
                        <th>Destination</th>
                        <th>Date</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
  )
}

export default page