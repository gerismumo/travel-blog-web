"use client"

import { IDestinationList, IWeatherDataList, IWeatherList, } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from './loading';
import Edit from './Edit';
import Add from './Add';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';

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



    //edit weather data
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<any>(null);
    const [editData, setEditData] = useState<IWeatherDataList | null>(null)
    const [openAdd, setOpenAdd] = useState<boolean>(false);

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

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentWDPage, setCurrentWDPage] = useState<{ [key: string]: number }>({});

  
    const itemsPerPage = 5;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleResetPg = () => {
        setCurrentPage(1);
    }

    const handleResetPgD =(id: string) => {
        setCurrentWDPage((prev) => ({
         ...prev,
          [id]: 1,
        }));
  
    }

    const pagesCount = Math.ceil(weatherData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDataPage = weatherData.slice(indexOfFirstItem, indexOfLastItem);

    //handle change for weather(data)
    const handleWDPageChange = (pageNumber: number, id: string) => {
        setCurrentWDPage((prev) => ({
          ...prev,
          [id]: pageNumber,
        }));
      };
    
      const getCurrentWDPage = (id: string) => currentWDPage[id] || 1;

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
            <button
            onClick={() => setOpenAdd(!openAdd)}
            type='button'
            className='px-[25px] py-[6px] rounded-[4px] bg-lightDark hover:bg-dark text-white'
            >Add</button>
            {openAdd && (
                <Add success={fetchData} close={setOpenAdd}/>
            )}
            <div className="flex flex-col">
                {currentDataPage?.length === 0 ? (
                    <div className="">No available </div>
                ) : (
                    <div className="flex flex-col gap-[10px]">
                        {currentDataPage?.map((d) => {
                            //pagination for each data
                        const wdPagesCount = Math.ceil(d.data.length / itemsPerPage);
                        const indexOfLastItemWD = getCurrentWDPage(d._id) * itemsPerPage;
                        const indexOfFirstItemWD = indexOfLastItemWD - itemsPerPage;
                        const currentWD = d.data.slice(indexOfFirstItemWD, indexOfLastItemWD);
                            return (
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
                                            {currentWD.map((w) => {
                                                return (
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
                                                )
                                            })}
                                            <div className="flex justify-center items-center mt-[20px] gap-[20px]">
                                                <button
                                                    onClick={() => handleWDPageChange(getCurrentWDPage(d._id) - 1, d._id)}
                                                    disabled={getCurrentWDPage(d._id) === 1}
                                                    
                                                >
                                                 <FontAwesomeIcon icon={fontawesome.faAnglesLeft}/>
                                                </button>
                                                <button
                                                    onClick={() => handleResetPgD(d._id)}
                                                >
                                                    <FontAwesomeIcon icon={fontawesome.faCreativeCommonsZero}/>
                                                </button>
                                                <button
                                                    onClick={() => handleWDPageChange(getCurrentWDPage(d._id) + 1, d._id)}
                                                    disabled={getCurrentWDPage(d._id) >= wdPagesCount}
                                                    
                                                >
                                                    <FontAwesomeIcon icon={fontawesome.faAnglesRight}/>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                            
                        )}
                    </div>
                )}
                <div className="flex flex-row justify-center mt-4 gap-[20px]">
                    <button
                    
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                         <FontAwesomeIcon icon={fontawesome.faAnglesLeft}/>
                    </button>
                    <button
                        onClick={() => handleResetPg()}
                    >
                        <FontAwesomeIcon icon={fontawesome.faCreativeCommonsZero}/>
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentDataPage.length < itemsPerPage || currentPage === pagesCount}
                    >
                        <FontAwesomeIcon icon={fontawesome.faAnglesRight}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
