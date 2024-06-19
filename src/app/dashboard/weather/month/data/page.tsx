"use client"

import { IDestinationList, IWeatherDataList, IWeatherMonthData, IWeatherMonthDataList,  } from '@/(types)/type'
import Loader from '@/app/components/Loader'
import { months } from '@/lib/months'
import { getDestinations } from '@/utils/(apis)/destinationApi'
import { getWeatherData, getWeatherMonthData } from '@/utils/(apis)/weatherApi'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const page = () => {
  const[data, setData] = useState<IWeatherMonthDataList[]>([])
  const[error, setError] = useState<string | null>(null)
  const[openEdit, setOpenEdit] = useState<Boolean>(false);
  const[openEditId, setOpenEditId] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<IDestinationList[]>([]);
  const [filteredData, setFilteredData] = useState<IWeatherMonthDataList[]>([]);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const data = await getWeatherMonthData();
      setData(data)
      setFilteredData(data);
    } catch (error: any) {
      setError(error.message)
    }finally{
      setLoadingWeather(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  if(error) {
    toast.error(error);
}

//destination list
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getDestinations();
          setDestinations(data);
        } catch (error : any) {
          setError(error.message);
        }finally{
          setLoadingDestinations(false);
        }
      };
  
      fetchData();
    }, [setDestinations, setError]);

//delete data fun
const HandleDelete = async(id : string) => {
  try {
    const response = await axios.delete(`/api/weather/month/${id}`)
    if(response.data.success) {
      fetchData();
      return toast.success(response.data.message);
    }else {
      return toast.error(response.data.message);
    }
  }catch(error: any) {
    return toast.error("network error");
  }
}

//edit data fun
  const[currrentData, setCurrentData] = useState<IWeatherMonthDataList | null>(null);

  const HandleEdit = (id : string) => {
    setOpenEdit(!openEdit)
    setOpenEditId(id);
    setCurrentData(data.find(d => d._id ===id) || null);
  }

 

  const handleSubmitEdit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(currrentData === null) {
      toast.error("no available data");
      return;
    }

    const weatherData: IWeatherMonthData = {
      destinationId: currrentData.destinationId,
      month: currrentData.month,
      year: currrentData.year,
      day: currrentData.day,
      airTemperature: currrentData.airTemperature,
      waterTemperature: currrentData.waterTemperature,
      humidity: currrentData.humidity,
      condition : currrentData.condition,
      sunnyHours: currrentData.sunnyHours,
    };

    //check empty fields
    for(const[key, value] of Object.entries(weatherData)) {
      if(!value) {
        toast.error("all fields are required");
        return;
      }
    }

    //submit data
    try {
      const response = await axios.put(`/api/weather/month/${currrentData._id}`, weatherData);
      if(response.data.success) {
        toast.success(response.data.message);
        setOpenEdit(false);
        fetchData();
      }else {
        toast.error(response.data.message);
      }
    }catch(error: any) {
      return toast.error("network error");
    }
    
  }

  const [searchDestination, setSearchDestination] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  

  //filterdata
  const filterByDestination = (data: any[], destinationId: string): any[] => {
    return data.filter(item => item.destinationId === destinationId);
  };
  
   const filterByYear = (data: any[], year: number): any[] => {
    return data.filter(item => parseInt(item.year) === year);
  };
  
   const filterByMonth = (data: any[], month: number): any[] => {
    return data.filter(item => parseInt(item.month) === month);
  };

  const handleFilter = () => {
    let tempData = data;

    if (searchDestination) {
      tempData = filterByDestination(tempData, searchDestination);
    }

    if (year) {
      tempData = filterByYear(tempData, year);
    }

    if (month) {
      tempData = filterByMonth(tempData, month);
    }

    setFilteredData(tempData);
  };


  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = currrentData && getDaysInMonth(currrentData.year, currrentData.month);
  //clear filter
  const clearFilter = () => {
    setSearchDestination(null);
    setYear(null);
    setMonth(null);
    setFilteredData(data);
  };

  //loader
  if(loadingWeather || loadingDestinations) {
    return(
      <Loader/>
    )
  }

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="inline-flex flex-col w-[600px]">
        <div className="flex flex-row items-center gap-[20px] p-4 border-[1px] border-[#ddd]  rounded-lg ">
          <div className="flex flex-col gap-[5px] w-[100%] ">
            <div className="flex flex-col">
              <label htmlFor="" className="text-[14px] font-[600]">
                Destination
              </label>
              <select name="destination" id="destination"
              value={searchDestination || ''}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="input w-[100%]"
              >
                <option value="">select destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="yearSelect" className="text-[14px] font-[600]">
                Select Year
              </label>
              <select
                id="yearSelect"
                value={year || ''}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="input w-[100%]"
              >
                <option value="">select year</option>
                {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, index) => (
                  <option key={2000 + index} value={2000 + index}>
                    {2000 + index}
                  </option>
                )).reverse()}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="monthSelect" className="text-[14px] font-[600]">
                Select Month
              </label>
              <select
                id="monthSelect"
                value={month || ''}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="input"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.id} value={month.id}>{month.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between w-[100%]">
            <button
              onClick={handleFilter}
              className="bg-lightDark hover:bg-dark text-white font-[500] py-[8px] px-4 rounded"
            >
              Filter
            </button>
            {data.length !== filteredData.length && (
              <button
                  onClick={clearFilter}
                  className="bg-lightDark hover:bg-dark text-white font-[500] py-[8px] px-4 rounded mt-4"
                >
              Clear Filter
            </button>
            )}
            
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-auto">
          <table className='border-collapse'>
            <caption className="caption-top font-[800] text-[14px">
              Weather data
            </caption>
            <thead>
              <tr>
                <th className='table-cell'>Destination</th>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Air Temperature</th>
                <th className='table-cell'>Water Temperature</th>
                <th className='table-cell'>Humidity</th>
                <th className='table-cell'>Condition</th>
                <th className='table-cell'>Sunny Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col justify-center items-center">
                      <p className='font-[800] text-[13px] '>no available data</p>
                    </div>
                  </td>
                </tr>
                
              ):filteredData.map((d) => (
                <React.Fragment key={d._id}>
                  <tr>
                    <td className='table-cell '>{destinations.find(ob => ob._id === d.destinationId)?.name}</td>
                    <td className='table-cell '>{`${d.day}/${d.month}/${d.year}`}</td>
                    <td className='table-cell '>{d?.airTemperature}</td>
                    <td className='table-cell '>{d?.waterTemperature}</td>
                    <td className='table-cell '>{d.humidity}</td>
                    <td className='table-cell '>{d.condition}</td>
                    <td className='table-cell '>{d.sunnyHours}</td>
                    <td className='table-cell '>
                      <button
                      onClick={() => HandleEdit(d._id)}
                      >{(openEdit && openEditId === d._id) ? "Close": "Edit"}</button>
                    </td>
                    <td className='table-cell '>
                      <button
                      onClick={() => HandleDelete(d._id)}
                      >Delete</button>
                    </td>
                  </tr>
                  {openEdit && currrentData && openEditId === d._id && (
                    <tr>
                      <td className='table-cell' colSpan={9}>
                        <div className="flex flex-col">
                          <form onSubmit={handleSubmitEdit} 
                            className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
                              <div className="flex flex-col">
                                <div className="flex flex-row justify-justify-around gap-[30px]">
                                  <div className="flex flex-col gap-[10px] w-[100%]">
                                    <div className="flex flex-col  w-[100%]">
                                      <label className="text-[14px] font-[600]" htmlFor="destination">
                                        Destination
                                      </label>
                                      <select name="destination" id="destination"
                                      className='input w-full'
                                        value={currrentData?.destinationId}
                                        onChange={(e) => setCurrentData(currrentData ? {...currrentData, destinationId: e.target.value}: null)}
                                      >
                                        <option value="">select destination</option>
                                        {destinations.length > 0 && destinations.map((obj) => (
                                          <option key={obj._id} value={obj._id}>{obj.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="year" className='text-sm font-[600]'>Year:</label>
                                        <select id="year" value={currrentData?.year} 
                                        onChange={(e) => setCurrentData(currrentData && {...currrentData, year: parseInt(e.target.value, 0)})}
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
                                        <select id="month" value={currrentData?.month}
                                        onChange={(e) => setCurrentData(currrentData && {...currrentData, month: parseInt(e.target.value, 0)})}
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
                                        <select id="day" value={currrentData?.day} 
                                        onChange={(e) => setCurrentData(currrentData && {...currrentData, day: parseInt(e.target.value, 0)})}
                                        className='input'
                                        >
                                        {Array.from({ length: daysInMonth ?? 0 }, (_, i) => (
                                            <option key={i} value={i + 1}>
                                            {i + 1}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-[10px]  w-[100%]">
                                    <div className="flex flex-col">
                                      <label className="text-[14px] font-[600]" htmlFor="temperature">
                                        Air Temperature (°C)
                                      </label>
                                      <input
                                        className="input"
                                        id="temperature"
                                        type="number"
                                        min={0}
                                        placeholder="Enter temperature"
                                        value={currrentData?.airTemperature}
                                        onChange={(e) => setCurrentData(currrentData ? {...currrentData, airTemperature: e.target.value}: null)}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <label className="text-[14px] font-[600]" htmlFor="waterTemperature">
                                      Water Temperature (°C)
                                      </label>
                                      <input
                                        className="input"
                                        id="waterTemperature"
                                        type="number"
                                        min={0}
                                        placeholder="Enter water temperature"
                                        value={currrentData?.waterTemperature}
                                        onChange={(e) => setCurrentData(currrentData ? {...currrentData, waterTemperature: e.target.value}: null)}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <label className="text-[14px] font-[600]" htmlFor="humidity">
                                        Humidity (%)
                                      </label>
                                      <input
                                        className="input"
                                        id="humidity"
                                        type="number"
                                        placeholder="Enter humidity"
                                        value={currrentData?.humidity}
                                        min={0}
                                        onChange={(e) => setCurrentData(currrentData ? {...currrentData, humidity: e.target.value}: null)}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-[10px]  w-[100%] ">
                                    <div className="flex flex-col">
                                      <label className="text-[14px] font-[600]" htmlFor="sunnyHours">
                                      Condition
                                      </label>
                                      <select name="condition" id="condition"
                                      value={currrentData?.condition}
                                      onChange={(e) => setCurrentData(currrentData ? {...currrentData, condition: e.target.value}: null)}
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
                                      <label className="text-[14px] font-[600]" htmlFor="sunnyHours">
                                      Sunny Hours
                                      </label>
                                      <input
                                        className="input"
                                        id="sunnyHours"
                                        type="number"
                                        min={0}
                                        placeholder="sunny hours"
                                        value={currrentData?.sunnyHours}
                                        onChange={(e) => setCurrentData(currrentData ? {...currrentData, sunnyHours: e.target.value}: null)}
                                      />
                                    </div>
                                  </div>
                                </div>
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
                      </td>
                    </tr>
                  )} 
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default page