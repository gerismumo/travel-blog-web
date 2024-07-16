"use client"

import { IDestinationContent, IDestinationList, ISuccessFormProp } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import Spinner from '@/app/components/Spinner';
import { destiationCategory } from '@/lib/destiCategory';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

type Props ={
  onSuccess: () => void,
  close: (value: boolean) => void
}

const DestInfoForm:React.FC<Props>  = ({onSuccess, close}) => {
    const[destination, setDestination] = useState<string>("");
    const[weatherInfo, setWeatherInfo] = useState<string>("");
    const[destinationMoreInfo, setDestinationMoreInfo] =useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [metaTitle, setMetaTitle] = useState<string>("");
    const [metaDescription, setMetaDescription] = useState<string>("");
    const [metaKeywords, setMetaKeywords] = useState<string>("");
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
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


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(destination === "" || weatherInfo === "" || destinationMoreInfo === "" || !image || metaTitle === "" || metaDescription === "" || metaKeywords === "") {
            return toast.error("all fields are required")
        }

        //
        const formData = new FormData();
        formData.append("destination", destination);
        formData.append("weatherInfo", weatherInfo);
        formData.append("destinationInfo", destinationMoreInfo);
        formData.append("image", image);
        formData.append("metaTitle", metaTitle);
        formData.append("metaDescription", metaDescription);
        formData.append("metaKeywords", metaKeywords);
        //submit data object to server

        setIsLoading(true);
        try{
            const response = await axios.post('/api/content', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            });
            if(response.data.success) {
                onSuccess();
                toast.success(response.data.message);
                setDestination('');
                setWeatherInfo('');
                setDestinationMoreInfo('');
                setImage(null);
                setMetaTitle('');
                setMetaDescription('');
                setMetaKeywords('');
                if (imageInputRef.current) {
                  imageInputRef.current.value = "";
                }
                setIsLoading(false);
                close(false);
            }else {
                toast.error(response.data.message);
                setIsLoading(false);
            }
        }catch(error) {
            toast.error("network error");
            setIsLoading(false);
        }finally {
          setIsLoading(false);
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
      className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px]">
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
            <label className="block text-gray-700 text-sm font-bold " htmlFor="imageUrl">
                Image<span className="text-red-500">*</span>
            </label>
            <input type="file"
                name="imageUrl" id="imageUrl"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
                className='input'
            />
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
            className="bg-lightDark hover:bg-[#3C4048] text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner/> : "Add"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DestInfoForm