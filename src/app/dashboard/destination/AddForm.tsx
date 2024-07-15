"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast';
import Spinner from '@/app/components/Spinner';

type Props = {
    success: () => void,
    close: (value: boolean) => void;
}

const AddForm:React.FC<Props>  = ({success, close}) => {

  const [destination, setDestination] = useState<string>('');
  const [stationId, setStationId] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if(!destination || !countryCode) {
      toast.error("All fields are required")
      return;
    }

    const data = {
        destination,
        stationId,
        countryCode,
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/destination', data);

      if (response.data.success) {
        toast.success(response.data.message);
        setDestination('');
        setStationId('');
        setCountryCode('');
        setIsLoading(false);
        close(true);
        success();
      } else {
        toast.error(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Network error');
      setIsLoading(false);
    }finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="w-[100%]">
      <form 
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
      >
        <div className="flex flex-col">
          <label htmlFor="destination">Destination</label>
          <input type="text"
          placeholder='e.g Kenya'
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className='input'
           />
        </div>
        <div className="flex flex-col">
          <label htmlFor="countryCode">Country Code</label>
          <input type="text"
          placeholder='e.g KE'
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className='input'
           />
        </div>
        <div className="flex flex-col">
          <label htmlFor="stationId">Station ID <span className='text-[13px]'>(Search in the stations page)</span></label>
          <input type="text"
          placeholder=''
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          className='input'
           />
        </div>
        
        <button
        type='submit'
        disabled={isLoading}
        className='bg-lightDark hover:bg-dark px-[30px] py-[6px] rounded-[6px] w-[100%] text-white'
        >
            {isLoading? <Spinner/> : "Add"}
        </button>
      </form>
    </div>
  )
}

export default AddForm