"use client"

import { IDestinationList, IWeatherMonthData } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const page: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [day, setDay] = useState<number>(1);
  const [destination, setDestination] = useState<string>('');
  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>('');
  const [waterTemperature, setWaterTemperature] = useState<string>('');
  const [condition, setCondition] = useState<string>("");
  const [sunnyHours, setSunnyHours] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [destinations, setDestinations] = useState<IDestinationList[]>([]);


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
  }, []);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value, 10));
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(parseInt(e.target.value, 10));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);

  //submit data

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: IWeatherMonthData = {
        destinationId: destination,
        year: year,
        month: month,
        day: day,
        airTemperature: temperature,
        humidity: humidity,
        waterTemperature: waterTemperature,
        condition: condition,
        sunnyHours: sunnyHours,
    }

    for(const[key, value] of Object.entries(data)) {
        if(!value) {
          toast.error("all fields are required");
          return;
        }
      }

      //submit 
    try {
      const response = await axios.post(`/api/weather/month`, data);
      if(response.data.success) {
        toast.success(response.data.message);
        setDestination('');
        setTemperature('');
        setHumidity('');
        setCondition('');
        setWaterTemperature('');
        setSunnyHours('');
        setDay(1);
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
      } else {
        toast.error(response.data.message);
      }
    } catch (error : any) {
      toast.error(error.message);
    }

  }

  //loader
  if(loading) {
    return (
        <Loader/>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
        <form
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
                {destinations.length > 0 && destinations.map((obj) => (
                <option key={obj._id} value={obj._id}>{obj.name}</option>
                ))}
            </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="year" className='text-sm font-[600]'>Year:</label>
                <select id="year" value={year} onChange={handleYearChange}
                className='input'
                >
                {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => (
                    <option key={2000 + i} value={2000 + i}>
                    {2000 + i}
                    </option>
                )).reverse()}
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="month" className='text-sm font-[600]'>Month:</label>
                <select id="month" value={month} onChange={handleMonthChange}
                className='input'
                >
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                ))}
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="day" className='text-sm font-[600]'>Day:</label>
                <select id="day" value={day} onChange={handleDayChange}
                className='input'
                >
                {Array.from({ length: daysInMonth }, (_, i) => (
                    <option key={i} value={i + 1}>
                    {i + 1}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold" htmlFor="temperature">
                Air Temperature (°C)
            </label>
            <input
                className="input"
                id="temperature"
                type="number"
                placeholder="Enter temperature"
                value={temperature}
                min={0}
                onChange={(e) => setTemperature(e.target.value)}
            />
            </div>
            <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="waterTemperature">
            Water Temperature (°C)
            </label>
            <input
                className="input"
                id="waterTemperature"
                type="number"
                placeholder="Enter water temperature"
                value={waterTemperature}
                min={0}
                onChange={(e) => setWaterTemperature(e.target.value)}
            />
            </div>
            <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="humidity">
                Humidity (%)
            </label>
            <input
                className="input"
                id="humidity"
                type="number"
                placeholder="Enter humidity"
                min={0}
                value={humidity || ''}
                onChange={(e) => setHumidity(e.target.value)}
            />
            </div>
            <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="sunnyHours">
            Condition
            </label>
            <select name="condition" id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className='input'
            >
                <option value="">select condition</option>
                <option value="Sunny">Sunny</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Rainy">Rainy</option>
                <option value="Snowy">Snowy</option>
                <option value="Windy">Windy</option>
                <option value="Foggy">Foggy</option>
                <option value="Dry">Dry</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
                <option value="Windy">Windy</option>
            </select>
            </div>
            <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold " htmlFor="sunnyHours">
            Sunny Hours
            </label>
            <input
                className="input"
                id="sunnyHours"
                type="number"
                placeholder="sunny hours"
                min={0}
                value={sunnyHours}
                onChange={(e) => setSunnyHours(e.target.value)}
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
    
  );
};

export default page;
