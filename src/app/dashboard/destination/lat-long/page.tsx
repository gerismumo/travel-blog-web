"use client"

import { IDestinationList } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

// interface LocationData {
//   id: string;
//   name: string;
//   elevation: number;
//   active: boolean;
//   distance: number;
// }

const Page:React.FC  = () => {
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  const [destinations, setDestinations] = useState<IDestinationList[]>([]);
  const [destination, setDestination] = useState<string>("");
  const [stationId, setStationId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getDestinations();
          setDestinations(data);
        } catch (error : any) {
          toast.error("network error");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [setDestinations]);



  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.get(`/api/destination/lon-lat?lat=${lat}&lon=${lon}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error");
    }
  }

  const handleUpdateStationId = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(!stationId || !destination) {
      return toast.error("all fields are required");
    }

    try{
      const response = await axios.put(`/api/destination/${destination}`, {stationId})
      if(response.data.success) {
        setStationId("");
        return toast.success(response.data.message)
      }else {
        return toast.error(response.data.message);
      }
    }catch(error) {
      toast.error("Network error");
      return;
    }
  } 

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Data</h1>
      <div className="flex flex-row justify-around">
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
             className='px-[25px] py-[6px] rounded-[4px] bg-lightDark hover:bg-darkBlue text-white'
            >Get Weather Data</button>
        </form>
        <form 
        onSubmit={handleUpdateStationId}
        className='flex flex-col gap-[10px]'
        >
            <div className="flex flex-col">
                <label htmlFor="">Destinations</label>
                <select name="destination" id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className='input'
                >
                    <option value="">select destination</option>
                    {destinations.map((destination: IDestinationList) => (
                        <option key={destination._id} value={destination._id}>{destination.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="stationId">Add Station Id</label>
                <input
                type="text"
                placeholder="Station Id"
                value={stationId}
                onChange={(e) =>  setStationId(e.target.value)}
                className='input '
                />
            </div>
            <button
            type='submit'
            className='px-[25px] py-[6px] rounded-[4px] bg-lightDark hover:bg-darkBlue text-white'
            >Update</button>
        </form>
      </div>
      

      {error && <p className="text-red-500 mt-4">{error}</p>}
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
