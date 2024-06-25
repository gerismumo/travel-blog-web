"use client"

import { IDestinationContent, IDestinationList } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinationsInfo } from '@/utils/(apis)/ContentApi';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface DestInfoFormProps {
    onSuccess: () => void;
  }

const DestInfoForm:React.FC<DestInfoFormProps>  = ({onSuccess}) => {
    const[destination, setDestination] = useState<string>("");
    const[weatherInfo, setWeatherInfo] = useState<string>("");
    const[destinationMoreInfo, setDestinationMoreInfo] =useState<string>("");
    const[image, setImage] = useState<string>("");
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getDestinations();
          setDestinations(data);
        } catch (error : any) {
          setError(error.message);
        }finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    if(error) {
        toast.error(error);
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(destination === "" || weatherInfo === "" || destinationMoreInfo === "" || image ==="") {
            return toast.error("all fields are required")
        }

        //
        const data: IDestinationContent = {
            destinationId: destination,
            weatherInfo: weatherInfo,
            destinationInfo: destinationMoreInfo,
            image: image,
        }

        //submit data object to server
        try{
            const response = await axios.post('/api/content', data);
            if(response.data.success) {
                onSuccess();
                toast.success(response.data.message);
                setDestination('');
                setWeatherInfo('');
                setDestinationMoreInfo('');
                setImage('');
            }else {
                toast.error(response.data.message);
            }
        }catch(error) {
            toast.error("network error");
        }
    }

    if(loading) {
      return (
        <Loader/>
      )
    }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} 
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
          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
            Weather Info <span className="text-red-500">*</span>
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
            Destination Info <span className="text-red-500">*</span>
          </label>
          <textarea name="weatherInfo" id="waetherInfo"
          placeholder=''
          value={destinationMoreInfo}
          onChange={(e) => setDestinationMoreInfo(e.target.value)}
          className='input w-full'
          >
          </textarea>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
            Image Url <span className="text-red-500">*</span>
          </label>
          <input type="url" 
          name="imageUrl" id="imageUrl"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className='input'
          />
        </div>
        <div className="flex flex-row w-[100%]">
          <button
            className="bg-lightDark hover:bg-[#3C4048] text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default DestInfoForm