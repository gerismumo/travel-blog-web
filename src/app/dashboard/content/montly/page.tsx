"use client"

import { months } from '@/lib/months';
import React, { useState } from 'react'


const page = () => {
    const[destination, setDestination] = useState<string>("");
    const[weatherInfo, setWeatherInfo] = useState<string>("");
    const[destinationMoreInfo, setDestinationMoreInfo] =useState<string>("");
    const[month, setMonth] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} 
      className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
            Destination
          </label>
          <select name="destination" id="destination"
          className='input w-full'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">select destination</option>
            <option value="London">London</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="month">
            Month
          </label>
          <select name="month" id="month"
          className='input w-full'
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">select month</option>
            {months.map((month) => (
                <option key={month.id} value={month.name}>{month.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
            Weather Info
          </label>
          <textarea name="weatherInfo" id="waetherInfo"
          value={weatherInfo}
          onChange={(e) => setWeatherInfo(e.target.value)}
          className='input w-full'
          >
          </textarea>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
            Destination Info
          </label>
          <textarea name="weatherInfo" id="waetherInfo"
          placeholder=''
          value={destinationMoreInfo}
          onChange={(e) => setDestinationMoreInfo(e.target.value)}
          className='input w-full'
          >
          </textarea>
        </div>
        <div className="flex flex-row w-[100%]">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default page