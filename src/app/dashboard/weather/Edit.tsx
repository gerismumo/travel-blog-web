"use client"

import { IWeatherDataList } from '@/(types)/type'
import Spinner from '@/app/components/Spinner'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    data: IWeatherDataList| null,
    close: (value: boolean) => void,
    success: () => void
}

const Edit:React.FC<Props> = ({data, close, success}) => {

    const [formData, setFormData] = useState<IWeatherDataList | null>(data);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // console.log("formData", formData);

    if (!formData) return null;

    const handleInputChange =(e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => (prev ? {...prev, [name]: value}: null))
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //submit edit data to the api
        setIsLoading(true);
        try {
            const response = await axios.put('/api/weather', formData);
            if(response.data.success) {
                toast.success(response.data.message);
                () => success();
                close(false);
                setIsLoading(false);
                return;
            } else {
                toast.error(response.data.message);
                setIsLoading(false);
            }
        }catch(error: any) {
            return toast.error("Network error");
        }finally{
            setIsLoading(false);
        }
    }


  return (
    <div className="w-[100%]">
        <form onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
        >
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Avg Temp (°C) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='tavg'
                value={formData.tavg}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Min Temp (°C) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='tmin'
                value={formData.tmin}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Max Temp (°C) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='tmax'
                value={formData.tmax}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Precipitation (mm) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='prcp'
                value={formData.prcp}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Snowfall Amount (cm) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='snow'
                value={formData.snow}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Wind Direction (°) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='wdir'
                value={formData.wdir}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Wind Speed (m/s) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='wspd'
                value={formData.wspd}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Peak Gust Wind Speed (m/s) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='wpgt'
                value={formData.wpgt}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Pressure (hPa)<span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='pres'
                value={formData.pres}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                    Sunshine Duration (hrs)<span className="text-red-500">*</span>
                </label>
                <input type="text"
                name='tsun'
                value={formData.tsun}
                onChange={(e) => handleInputChange(e)}
                
                className='input'
                />
            </div>
            <div className="flex flex-row justify-center items-center">
                <button
                type='submit'
                disabled={isLoading}
                className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                {isLoading ? <Spinner/> : "Edit"}
                </button>
            </div>
        </form>

    </div>
  )
}

export default Edit