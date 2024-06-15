"use client"

import { IDestinationList, IWeatherData } from '@/(types)/destination';
import { getDestinations} from '@/utils/(apis)/destinations/api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';


const TemperatureForm: React.FC = () => {
  const [destination, setDestination] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>('');
  const [waterTemperature, setWaterTemperature] = useState<string>('');
  const [condition, setCondition] = useState<string>("");
  const [sunnyHours, setSunnyHours] = useState<string>("");


  const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getDestinations();
          setDestinations(data);
        } catch (error : any) {
          setError(error.message);
        }
      };
  
      fetchData();
    }, []);

 

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const weatherData: IWeatherData = {
      destinationId: destination,
      date: selectedDate,
      airTemperature: temperature,
      waterTemperature: waterTemperature,
      humidity,
      condition,
      sunnyHours: sunnyHours,
    };

    for(const[key, value] of Object.entries(weatherData)) {
      if(!value) {
        toast.error("all fields are required");
        return;
      }
    }
    
    try {
      const response = await axios.post('/api/destination-weather',weatherData);
      
      if(response.data.success) {
          toast.success(response.data.message);
        //reset all fieds values

          setDestination('');
          setSelectedDate('');
          setTemperature('');
          setHumidity('');
          setCondition('');
          setWaterTemperature('');
          setSunnyHours('');
      }else {
        toast.error(response.data.message);
      }
    }catch(error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} 
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
          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
            Date
          </label>
          <input type="date" name="date" id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className='input'
           />
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
            value={sunnyHours}
            onChange={(e) => setSunnyHours(e.target.value)}
          />
        </div>
        <div className="flex flex-row w-[100%]">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemperatureForm;
