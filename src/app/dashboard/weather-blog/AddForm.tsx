"use client"

import { IDestinationList, IWeatherBlog } from '@/(types)/type';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const AddForm = () => {
    const[destination, setDestination] = useState<string>("");
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [heading, setHeading] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDestinations();
            setDestinations(data);
          } catch (error : any) {
            toast.error(error.message);
          }finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [setDestinations]);

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(destination === "" || heading === "") {
            return toast.error("all fields are required")
        }

        //
        const data:IWeatherBlog = {
            destination: destination,
            heading: heading
        }

        try {
            const response = await axios.post('/api/weather-blog', data);
            if(response.data.success) {
                return toast.success(response.data.message);
            }else {
                return toast.error(response.data.message);
            }
        }catch(error: any) {
            toast.error(error.message);
        }
      }

  return (
    <div className="w-[100%]">
        <form 
        onSubmit={handleSubmit}
         className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Destination <span className="text-red-500">*</span>
                </label>
                <select name="destination" id="destination"
                className='input w-full'
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                >
                    <option value="">select destination</option>
                    {destinations.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="heading">
                Heading <span className="text-red-500">*</span>
                </label>
                <input type="text" 
                name="heading" id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className='input'
                />
            </div>
            <div className="flex flex-row w-[100%]">
                <button
                    className="bg-lightDark hover:bg-dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddForm