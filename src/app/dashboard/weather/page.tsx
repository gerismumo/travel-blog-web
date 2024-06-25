"use client"

import { IDestinationList } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
    const [weatherData, setWeatherData] = useState<any[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]); 
    const [selectedDestination, setSelectedDestination] = useState<string>("");

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

    const fetchData = async (startDate: string, endDate: string, destinationId: string) => {
        try {
            const response = await axios.get(`/api/weather`, {
                params: {
                    startDate,
                    endDate,
                    destinationId
                }
            });
            if (response.data.success) {
                setWeatherData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Network error");
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate, selectedDestination);
    }, [startDate, endDate, selectedDestination]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(startDate, endDate, selectedDestination);
    };

    const handleReset = () => {
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setSelectedDestination("");
        fetchData(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0], "");
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col p-4">
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="flex flex-row items-center gap-[30px]">
                    <button
                        type="submit"
                        className="bg-lightDark hover:bg-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Fetch Weather Data
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-lightDark hover:bg-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel Filter
                    </button>
                </div>
                
            </form>

            <div>
                <table className="min-w-full border-collapse block md:table">
                    <thead className="block md:table-header-group">
                        <tr className="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Destination</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Date</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Avg Temp (°C)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Min Temp (°C)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Max Temp (°C)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Precipitation (mm)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Snowfall Amount (cm)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Wind Direction (°)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Wind Speed (m/s)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Peak Gust Wind Speed (m/s)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Pressure (hPa)</th>
                            <th className="bg-gray-100 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">Sunshine Duration (hrs)</th>
                        </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                        {weatherData.length === 0 ? (
                            <tr className="border border-gray-300 md:border-none block md:table-row">
                                <td colSpan={12} className="p-2 md:border md:border-gray-300 text-center block md:table-cell">No Data</td>
                            </tr>
                        ) : (
                            weatherData.map((d) => (
                                <React.Fragment key={d.destination}>
                                    {(d.data.data !== null || d.data.data !== undefined) && d.data?.data?.map((t: any, index: any) => (
                                        <tr key={`${d.destination}-${index}`} className="border border-gray-300 md:border-none block md:table-row">
                                            {index === 0 ? (
                                                <td rowSpan={d.data.data.length} className="p-2 md:border md:border-gray-300 block md:table-cell">
                                                    {destinations.find(l => l._id === d.destination)?.name}
                                                </td>
                                            ) : null}
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.date}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.tavg}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.tmin}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.tmax}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.prcp}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.snow || '-'}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.wdir}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.wspd}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.wpgt}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.pres}</td>
                                            <td className="p-2 md:border md:border-gray-300 block md:table-cell">{t.tsun || '-'}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
