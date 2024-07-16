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
import { ReadableStreamDefaultController } from 'node:stream/web';

const Page = () => {
    const [weatherData, setWeatherData] = useState<IWeatherList[]>([]);
    const [filterData, setFilterData] = useState<IWeatherList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [selectedDestination, setSelectedDestination] = useState<string>("");
    const [searchDate, setSearchDate] = useState<string>("");
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
        } catch (error: any) {
            toast.error("Network error");
        }finally{
            setLoadingData(false);
        }
    };

    // console.log("weatherData",weatherData);

    useEffect(() => {
        let isMounted = true;
        fetchData();
        return () => {
            isMounted = false;
        };
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

    //handle delete
    const handleDelete = async(id: string) => {
        try{
            const response = await axios.delete(`/api/weather/${id}`);
            if(response.data.success) {
                toast.success(response.data.message);
                fetchData();
            }else {
                toast.error(response.data.message);
            }
        }catch(error: any) {
            return toast.error("Network error")
        }
    }

    useEffect(() => {
        setFilterData(weatherData)
    }, [weatherData, setFilterData])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDestination && !searchDate) {
            setFilterData(weatherData.filter((d) => {
                return d.destination.toString().toLowerCase().includes(selectedDestination.toLowerCase());
            }));
        } else if (!selectedDestination && searchDate) {
            setFilterData(weatherData.filter((d) => {
                return d.data.some((w) => w.date.toString().toLowerCase().includes(searchDate.toLowerCase()));
            }));
        } else if (selectedDestination && searchDate) {
            setFilterData(weatherData.filter((s) => {
                const destinationMatch = s.destination.toString().toLowerCase().includes(selectedDestination.toLowerCase());
                const dateMatch = s.destination && s.data.filter((d) => d.date.toString().toLowerCase().includes(searchDate.toLowerCase()));
                // console.log("dateMatch",dateMatch)
                return destinationMatch && dateMatch;
            }));
        } else {
            setFilterData(weatherData)
        }
    };
    

    const handleReset = () => {
        setSearchDate("");
        setSelectedDestination("");
        setFilterData(weatherData);
    }

    //pagination funs
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

    const pagesCount = Math.ceil(filterData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDataPage = filterData.slice(indexOfFirstItem, indexOfLastItem);

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
            <form onSubmit={(e) => handleSearch(e)} className="flex flex-col gap-[10px]">
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Destination
                    </label>
                    <select
                        value={selectedDestination}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">select</option>
                        {destinations.map((destination) => (
                            <option key={destination._id} value={destination._id}>
                                {destination.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex flex-col xs1:flex-row items-center gap-[10px] xs1:gap-[30px]">
                    <button
                        type="submit"
                        className="bg-lightDark w-[100%] xs1:w-auto hover:bg-dark text-nowrap text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Search
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
            >
                {openAdd ? "Close": "Add New"}
            </button>
            {openAdd && (
                <Add success={fetchData} close={setOpenAdd}/>
            )}
            {/* <div className="flex flex-row justify-end">
                <button
                className='px-[20px] py-[4px] rounded-[4px] text-white bg-red-400'
                >Delete All</button>
            </div> */}
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
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-col">
                                            <p className='text-nowrap'>Total:<span>{d.data.length}</span></p>
                                        </div>
                                        <div className="flex flex-col  ">
                                            <h2 className='font-[800] text-dark'>{destinations.find(t => t._id === d.destination)?.name}</h2>
                                        </div>
                                        <div></div>
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
                                                            <div className="flex flex-row items-center justify-start gap-[30px]">
                                                                <button
                                                                onClick={() => handleOpenEdit(w)}
                                                                type='button'
                                                                className={`${openEdit && openEditId === w._id ? "px-[20px] py-[6px] rounded-[4px]  text-white bg-lightDark hover:bg-dark": "text-[25px]"} `}
                                                                >
                                                                    {openEdit && openEditId === w._id ? "Close" : <FontAwesomeIcon icon={fontawesome.faPenToSquare}/>}
                                                                </button>
                                                                <button
                                                                onClick={() => handleDelete(w._id)}
                                                                type='button'
                                                                className='text-[25px] text-red-400'
                                                                >
                                                                    <FontAwesomeIcon icon={fontawesome.faTrashCan}/>
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
                                                            <Edit data={editData} success={() =>fetchData()} close={setOpenEdit} />
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                            <div className="flex justify-center items-center mt-[20px] gap-[30px]">
                                                <div className="relative group">
                                                    <button
                                                        onClick={() => handleWDPageChange(getCurrentWDPage(d._id) - 1, d._id)}
                                                        disabled={getCurrentWDPage(d._id) === 1}
                                                        className="relative z-10"
                                                    >
                                                        <FontAwesomeIcon icon={fontawesome.faAnglesLeft} />
                                                    </button>
                                                    <div className="absolute bottom-full mb-[1px] hidden group-hover:block">
                                                        <div className="px-2 py-1 text-gray-700 rounded">Prev</div>
                                                    </div>
                                                </div>

                                                <div className="relative group">
                                                    <button
                                                        onClick={() => handleResetPgD(d._id)}
                                                        className="relative z-10"
                                                    >
                                                        <FontAwesomeIcon icon={fontawesome.faCreativeCommonsZero} />
                                                    </button>
                                                    <div className="absolute bottom-full mb-[1px] hidden group-hover:block">
                                                        <div className="px-2 py-1 text-gray-700  rounded">Reset</div>
                                                    </div>
                                                </div>

                                                <div className="relative group">
                                                    <button
                                                        onClick={() => handleWDPageChange(getCurrentWDPage(d._id) + 1, d._id)}
                                                        disabled={getCurrentWDPage(d._id) >= wdPagesCount}
                                                        className="relative z-10"
                                                    >
                                                        <FontAwesomeIcon icon={fontawesome.faAnglesRight} />
                                                    </button>
                                                    <div className="absolute bottom-full mb-[1px] hidden group-hover:block">
                                                        <div className="px-2 py-1 text-gray-700  rounded">Next</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                            
                        )}
                    </div>
                )}
                <div className="flex flex-row justify-center mt-4 gap-[30px]">
                    <div className="relative group">
                        <button
                            
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative z-10"
                        >
                            <FontAwesomeIcon icon={fontawesome.faAnglesLeft}/>
                        </button>
                        <div className="absolute bottom-full mb-[1px] hidden group-hover:block">
                            <div className="px-2 py-1 text-gray-700  rounded">Prev</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() => handleResetPg()}
                            className="relative z-10"
                        >
                            <FontAwesomeIcon icon={fontawesome.faCreativeCommonsZero}/>
                        </button>
                        <div className="absolute bottom-full mb-[1px] hidden group-hover:block">
                            <div className="px-2 py-1 text-gray-700  rounded">Reset</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentDataPage.length < itemsPerPage || currentPage === pagesCount}
                            className="relative z-10"
                        >
                            <FontAwesomeIcon icon={fontawesome.faAnglesRight}/>
                        </button>
                        <div className="absolute bottom-full mb-[1px] hidden group-hover:block">
                            <div className="px-2 py-1 text-gray-700  rounded">Next</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
