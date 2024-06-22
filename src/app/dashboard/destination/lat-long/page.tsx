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

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Data</h1>
      <div className="flex flex-row justify-around">
        <form onSubmit={handleSearch} className='flex flex-col space-y-4'>
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
            className='p-2 bg-blue-500 text-white rounded'
            >Get Weather Data</button>
        </form>
        <form action="">
            <div className="flex flex-col">
                <label htmlFor="">Destinations</label>
                <select name="destination" id="destination"
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
                className='input '
                />
            </div>
            <button
            type='submit'
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
