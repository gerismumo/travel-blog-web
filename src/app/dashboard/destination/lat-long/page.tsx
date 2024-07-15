"use client"

import Spinner from '@/app/components/Spinner';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Page:React.FC  = () => {
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  
  
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!lat || !lon) {
      return toast.error("All fields are required");
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`/api/destination/lon-lat?lat=${lat}&lon=${lon}`);
      if (response.data.success) {
        setData(response.data.data);
        setIsLoading(false);
      } else {
        toast.error(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Network error");
      setIsLoading(false);
    }finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Search Station ID </h1>
      <div className="w-[100%]">
        <form onSubmit={handleSearch} className='flex flex-col gap-[10px]'>
            <input
            type="text"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className='input p-2 border rounded'
            />
            <input
            type="text"
            placeholder="Longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className='input p-2 border rounded'
            />
            <button
            type='submit'
            disabled={isLoading}
             className='px-[25px] py-[6px] rounded-[4px] bg-lightDark hover:bg-darkBlue text-white'
            >{isLoading ? <Spinner/> : "Search"}</button>
        </form>
      </div>
      {data && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Elevation</th>
                <th className="py-2 px-4 border">Active</th>
                <th className="py-2 px-4 border">Distance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((location: any) => (
                <tr key={location.id}>
                  <td className="py-2 px-4 border">{location.id}</td>
                  <td className="py-2 px-4 border">{location.name}</td>
                  <td className="py-2 px-4 border">{location.elevation}</td>
                  <td className="py-2 px-4 border">{location.active ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border">{location.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Page
