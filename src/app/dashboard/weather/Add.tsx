"use client"

import { IDestinationList } from '@/(types)/type';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  success: () => void,
  close: (value: boolean) => void;
};

interface WeatherData {
  tavg: string;
  tmin: string;
  tmax: string;
  prcp: string;
  snow: string;
  wdir: string;
  wspd: string;
  wpgt: string;
  pres: string;
  tsun: string;
}

interface ContentBlock {
  year: number;
  month: number;
  day: number;
  weatherData: WeatherData;
}

const Add: React.FC<Props> = ({success, close}) => {
  const [destinations, setDestinations] = useState<IDestinationList[]>([]);
  const[destination, setDestination] = useState<string>("");
  const[AYear, setAYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      weatherData: {
        tavg: "",
        tmin: "",
        tmax: "",
        prcp: "",
        snow: "",
        wdir: "",
        wspd: "",
        wpgt: "",
        pres: "",
        tsun: ""
      }
    }
  ]);

  //destination
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error : any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setDestinations]);

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
      years.push(i);
    }
    return years.reverse();
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDays = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index].weatherData = {
      ...newContentBlocks[index].weatherData,
      [name]: value,
    };
    setContentBlocks(newContentBlocks);
  };

  const handleSelectChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    const value = parseInt(e.target.value);
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = {
      ...newContentBlocks[index],
      [type]: value,
      day: type !== 'day' ? 1 : newContentBlocks[index].day,
    };
    setContentBlocks(newContentBlocks);
  };

  const addContentBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        weatherData: {
          tavg: "",
          tmin: "",
          tmax: "",
          prcp: "",
          snow: "",
          wdir: "",
          wspd: "",
          wpgt: "",
          pres: "",
          tsun: ""
        }
      }
    ]);
  };

  const deleteContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle submit

    const updateBlock = contentBlocks.map((d) => {
      const updatedData = {
        date: `${d.year}-${d.month}-${d.day}`,
        tavg: d.weatherData.tavg,
        tmin: d.weatherData.tmin,
        tmax: d.weatherData.tmax,
        prcp: d.weatherData.prcp,
        snow: d.weatherData.snow,
        wdir: d.weatherData.wdir,
        wspd: d.weatherData.wspd,
        wpgt: d.weatherData.wpgt,
        pres: d.weatherData.pres,
        tsun: d.weatherData.tsun,
      }
      return updatedData;
    })

    const data = {
      destination,
      data: updateBlock
    }

    //submit data

    try{
      const response = await axios.post('/api/weather/nw', data);
      if(response.data.success) {
        setContentBlocks([
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            weatherData: {
              tavg: "",
              tmin: "",
              tmax: "",
              prcp: "",
              snow: "",
              wdir: "",
              wspd: "",
              wpgt: "",
              pres: "",
              tsun: ""
            }
          }
        ])
        success();
        close(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }catch(error : any) {
      toast.error("Network error");
    }
  };

  const [openM, setOpenM]= useState<boolean>(true);
  const [openA, setOpenA] = useState<boolean>(false);

  const handleGenData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(AYear === ""){
      return toast.error("Year field is required");
    }

    try{
      const response = await axios.post(`/api/weather?year=${AYear}`);
      if(response.data.success) {
        success();
        setAYear("");
        toast.success(response.data.message);
        setOpenA(false);
        return;
      }else {
        toast.error(response.data.message);
        return;
      }
    }catch(error: any) {
      toast.error("Network error");
      return;
    }
  }

  return (
    <div className="w-[100%]">
      <div className="flex flex-row gap-[30px] items-center">
        <button 
        onClick={() => {setOpenM(!openM); setOpenA(false) }}
        type='button'
        className='px-[20px] py-[5px] rounded-[6px]  text-orange-800'
        >
          Add Manual
        </button>
        <button
        onClick={() => {setOpenA(!openA); setOpenM(false)}}
        type='button'
        className='px-[20px] py-[5px] rounded-[6px]  text-orange-800'
        >
          Add Auto
        </button>
      </div>
      {openA && (
        <form 
        onSubmit={(e) => handleGenData(e)}
        className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
        >
          <div className="flex flex-col">
            <label className='text-lightDark font-[500]' htmlFor="year">Year</label>
            <select name="year" id="year"
            value={AYear}
            onChange={(e) => setAYear(e.target.value)}
            className='input'

            >
              <option value="">select</option>
              {generateYears().map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
          type='submit'
          className='px-[30px] py-[5px] bg-lightDark hover:bg-dark text-white'
          >Generate</button>
        </form>
      )}
      {openM && (
        <form 
        onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
        >
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
          <button
          type="button"
          onClick={addContentBlock}
          className='px-[30px] py-[5px] rounded-[6px] bg-lightDark hover:bg-dark text-white'
          >Add More</button>
          {contentBlocks.map((block, index) => (
            <div key={index} className="flex flex-col gap-4 p-4 border rounded-md">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteContentBlock(index)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-bold" htmlFor="year">
                  Year
                </label>
                <select
                  value={block.year}
                  onChange={(e) => handleSelectChange(index, e, 'year')}
                  className="input"
                >
                  {generateYears().map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-bold" htmlFor="month">Month</label>
                <select
                  value={block.month}
                  onChange={(e) => handleSelectChange(index, e, 'month')}
                  className="input"
                >
                  {generateMonths().map((mo) => (
                    <option key={mo} value={mo}>
                      {mo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-bold" htmlFor="day">Day</label>
                <select
                  value={block.day}
                  onChange={(e) => handleSelectChange(index, e, 'day')}
                  className="input"
                >
                  {Array.from({ length: generateDays(block.year, block.month) }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span>Weather Data</span>
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="tavg">
                  Avg Temp (°C) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='tavg'
                  value={block.weatherData.tavg}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="tmin">
                  Min Temp (°C) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='tmin'
                  value={block.weatherData.tmin}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="tmax">
                  Max Temp (°C) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='tmax'
                  value={block.weatherData.tmax}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="prcp">
                  Precipitation (mm) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='prcp'
                  value={block.weatherData.prcp}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="snow">
                  Snowfall (mm) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='snow'
                  value={block.weatherData.snow}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="wdir">
                  Wind Direction <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='wdir'
                  value={block.weatherData.wdir}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="wspd">
                  Wind Speed (km/h) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='wspd'
                  value={block.weatherData.wspd}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="wpgt">
                  Wind Gust (km/h) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='wpgt'
                  value={block.weatherData.wpgt}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="pres">
                  Pressure (hPa) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='pres'
                  value={block.weatherData.pres}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="tsun">
                  Sunshine (hours) <span className="text-red-500">*</span>
                </label>
                <input type="text"
                  name='tsun'
                  value={block.weatherData.tsun}
                  onChange={(e) => handleInputChange(index, e)}
                  
                  className='input'
                />
              </div>
            </div>
          ))}
          <button
          type='submit'
          className='px-[30px] py-[10px] bg-lightDark hover:bg-dark rounded-[6px] text-white font-bold'
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Add;
