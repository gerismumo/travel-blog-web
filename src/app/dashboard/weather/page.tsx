"use client"

import { IDestinationList, IWeatherDataList, IWeatherList, } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from './loading';
import Edit from './Edit';

const Page = () => {
    const [weatherData, setWeatherData] = useState<IWeatherList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]); 
    const [selectedDestination, setSelectedDestination] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingData, setLoadingData] = useState<boolean>(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDestinations();
                setDestinations(data);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/weather`);
            if (response.data.success) {
                setWeatherData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Network error");
        }finally{
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("response", weatherData)

    //edit weather data
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<any>(null);
    const [editData, setEditData] = useState<IWeatherDataList | null>(null)

    const handleOpenEdit = (data: IWeatherDataList) => {
        setOpenEdit(!openEdit);
        setOpenEditId(data._id);
        setEditData(data);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

    };

    const handleReset = () => {
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setSelectedDestination("");
    }

    if (loading || loadingData) {
        return (
            <Loading/>
        )
    }

    return (
        <div className="flex flex-col gap-[30px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Destination
                    </label>
                    <select
                        value={selectedDestination}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">All Destinations</option>
                        {destinations.map((destination) => (
                            <option key={destination._id} value={destination._id}>
                                {destination.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex flex-col xs1:flex-row items-center gap-[10px] xs1:gap-[30px]">
                    <button
                        type="submit"
                        className="bg-lightDark w-[100%] xs1:w-auto hover:bg-dark text-nowrap text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Fetch Weather Data
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-lightDark w-[100%] xs1:w-auto hover:bg-dark text-nowrap text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel Filter
                    </button>
                </div>
                
            </form>
            <div className="flex flex-col">
                {weatherData?.length === 0 ? (
                    <div className="">No available </div>
                ) : (
                    <div className="flex flex-col gap-[10px]">
                        {weatherData?.slice(0, 6).map((d) => (
                            <div key={d._id} className='flex flex-col gap-[10px] p-[10px] border-[1px] border-grey shadow-sm rounded-[5px]'>
                                <div className="flex flex-col justify-center items-center ">
                                    <h2 className='font-[800] text-dark'>{destinations.find(t => t._id === d.destination)?.name}</h2>
                                </div>
                                {d.data.length === 0 ? (
                                    <div className="flex flex-col justify-center items-center ">
                                        <p className='text-[14px] text-red-400'>No available weather data in {destinations.find(t => t._id === d.destination)?.name}</p>
                                    </div>
                                ): (
                                    <div className="flex flex-col gap-[10px]">
                                        {d.data.slice(0, 5).map((w) => (
                                            <React.Fragment key={w._id}>
                                                <div  className='flex flex-col gap-[10px] shadow-inner p-[10px]'>
                                                    <div className="flex flex-row justify-start">
                                                        <button
                                                        onClick={() => handleOpenEdit(w)}
                                                        type='button'
                                                        className='px-[20px] py-[6px] rounded-[4px] text-white bg-lightDark hover:bg-dark'
                                                        >
                                                            {openEdit && openEditId === w._id ? "Close" : "Edit"}
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-row overflow-auto  border-[1px] border-[#ddd]">
                                                        <div className="flex flex-col justify-between items-center p-[10px] border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Date</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.date || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Avg Temp (°C)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.tavg || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Min Temp (°C)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.tmin || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Max Temp (°C)</h2> 
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.tmax || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Precipitation (mm)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.prcp || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Snowfall Amount (cm)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.snow || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Wind Direction (°)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.wdir || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Wind Speed (m/s)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.wspd || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Peak Gust Wind Speed (m/s)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.wpgt || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-1-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Pressure (hPa)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.pres || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col justify-between items-center p-[10px]  border-1-[1px] border-l-[#ddd]">
                                                            <div className="flex flex-col justify-center items-center ">
                                                                <h2 className='font-[600] text-lightDark'>Sunshine Duration (hrs)</h2>
                                                            </div>
                                                            <p className='text-orange-800 text-[15px]'>{w.tsun || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {openEdit && openEditId === w._id && (
                                                    <Edit data={editData}/>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
            </div>
             <div className='overflow-auto'>
                {/* <table className=" border-collapse ">
                    <thead>
                        <tr>
                            <th  className='table-cell'>Destination</th>
                            <th  className='table-cell'>Date</th>
                            <th  className='table-cell'>Avg Temp (°C)</th>
                            <th  className='table-cell'>Min Temp (°C)</th>
                            <th  className='table-cell'>Max Temp (°C)</th>
                            <th  className='table-cell'>Precipitation (mm)</th>
                            <th  className='table-cell'>Snowfall Amount (cm)</th>
                            <th  className='table-cell'>Wind Direction (°)</th>
                            <th  className='table-cell'>Wind Speed (m/s)</th>
                            <th  className='table-cell'>Peak Gust Wind Speed (m/s)</th>
                            <th  className='table-cell'>Pressure (hPa)</th>
                            <th  className='table-cell'>Sunshine Duration (hrs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weatherData.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="p-2 md:border md:border-gray-300 text-center block md:table-cell">No Data</td>
                            </tr>
                        ) : (
                            weatherData.map((d) => (
                                <React.Fragment key={d._id}>
                                    {d.data?.length === 0 ? (
                                        <tr>
                                            <td>
                                                <p>No weather data here</p>
                                            </td>
                                        </tr>
                                    ): d.data?.map((t: any, index: any) => (
                                        <tr key={`${d.destination}-${index}`} >
                                            {index === 0 ? (
                                                <td rowSpan={d.data.length}  className='table-cell'>
                                                    {d.destination}
                                                </td>
                                            ) : null}
                                            <td  className='table-cell'>{t.date}</td>
                                            <td  className='table-cell'>{t.tavg}</td>
                                            <td  className='table-cell'>{t.tmin}</td>
                                            <td  className='table-cell'>{t.tmax}</td>
                                            <td  className='table-cell'>{t.prcp}</td>
                                            <td  className='table-cell'>{t.snow || '-'}</td>
                                            <td  className='table-cell'>{t.wdir}</td>
                                            <td  className='table-cell'>{t.wspd}</td>
                                            <td  className='table-cell'>{t.wpgt}</td>
                                            <td  className='table-cell'>{t.pres}</td>
                                            <td  className='table-cell'>{t.tsun || '-'}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table> */}
            </div> 
        </div>
    );
};

export default Page;
