"use client"

import { IDestinationList, IDestinationMonthContent, ISuccessFormProp } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';


const AddForm:React.FC<ISuccessFormProp>  = ({onSuccess}) => {
    const[destination, setDestination] = useState<string>("");
    const[weatherInfo, setWeatherInfo] = useState<string>("");
    const[month, setMonth] = useState<string>('');
    const [metaTitle, setMetaTitle] = useState<string>("");
    const [metaDescription, setMetaDescription] = useState<string>("");
    const [metaKeywords, setMetaKeywords] = useState<string>("");
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

        if(destination === "" ||  weatherInfo === ""  || month === "" ||  metaTitle === "" || metaDescription === "" || metaKeywords === "") {
            return toast.error("allf fields are required")
        }

        const data: IDestinationMonthContent = {
            destination: destination,
            month: month,
            weatherInfo: weatherInfo,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeywords,
        }

        //submit data object to server
        try {
            const response = await axios.post('/api/content/month', data);
            if(response.data.success) {
                onSuccess();
                toast.success(response.data.message);
                setDestination('');
                setWeatherInfo('');
                setMonth('');
                setMetaTitle('');
                setMetaDescription('');
                setMetaKeywords('');
            }else {
                toast.error(response.data.message);
            }
        }catch(error) {
            return toast.error("network error")
        }
    }


    if(loading) {
      return (
        <Loader/>
      )
    }

  return (
    <div className="w-[100%]">
      <form onSubmit={handleSubmit} 
      className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]">
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
          <label className="block text-gray-700 text-sm font-bold " htmlFor="month">
            Month <span className="text-red-500">*</span>
          </label>
          <select name="month" id="month"
          className='input w-full'
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">select month</option>
            {months.map((month) => (
                <option key={month.id} value={month.id}>{month.name}</option>
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
            <span className="block text-gray-700 text-sm font-bold ">SEO Data</span>
        </div>
        <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                Meta title <span className="text-red-500">*</span>
            </label>
            <input type="text"
            name="metaTitle" id="metaTitle"
            value={metaTitle} 
            onChange={(e) => setMetaTitle(e.target.value)}
            className='input'
            />
        </div>
        <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                Meta description <span className="text-red-500">*</span>
            </label>
            <textarea name="metaDescription" id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className='input '
            >
            </textarea>
        </div>
        <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                Meta keywords <span className="text-red-500">*</span>
            </label>
            <textarea name="metaKeywords" id="metaKeywords"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            className='input '
            >
            </textarea>
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