"use client"

import { IDestinationList, IDestinationMonthContent, IDestinationMonthContentList } from '@/(types)/type'
import Loader from '@/app/components/Loader';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {
    const[contentList, setContentList] = useState<IDestinationMonthContentList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [openEdit , setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [editObject, setEditObject] = useState<IDestinationMonthContentList | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingDestination, setLoadingDestination] = useState<boolean>(true);
    const [loadingContent, setLoadingContent] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/content/month');
            if (response.data.success) {
                setContentList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('network error');
        }finally {
            setLoadingContent(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDestinations();
            setDestinations(data);
          } catch (error : any) {
            toast.error(error.message);
          }finally {
            setLoadingDestination(false);
          }
        };
    
        fetchData();
      }, [setDestinations]);

      //delete data 
      const deleteData = async (id: string) => {
        try {
          const response = await axios.delete(`/api/content/month/${id}`);
          if (response.data.success) {
            toast.success(response.data.message);
            fetchData();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error('network error');
        }
      };

      //edit data
      const handleEditOpen = (id: string) => {
        setOpenEdit(!openEdit);
        setOpenEditId(id);
        setEditObject(contentList.find(d => d._id === id) || null);
      }

      const handleSubmitEdit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(editObject === null) {
          toast.error("no available data");
          return;
        }


        const data: IDestinationMonthContentList = {
            _id: editObject._id,
            destinationId: editObject.destinationId,
            month: editObject.month,
            weatherInfo: editObject.weatherInfo,
        };

        //check empty fields
        for(const[key, value] of Object.entries(data)) {
            if(!value) {
            toast.error("all fields are required");
            return;
            }
        }


        //submit data

        try {
            const response = await axios.put(`/api/content/month/${editObject._id}`, data);
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

      //search query
    const[filteredData, setFilteredData] = useState<IDestinationMonthContentList[]>([])

    useEffect(() => {
        setFilteredData(
            contentList.filter((item) =>
                destinations.find((dest) => dest._id === item.destinationId)?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                months.find((m) => m.id === parseInt(item.month))?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, contentList, destinations]);

    //loader
    if(loadingDestination || loadingContent) {
        return (
            <Loader/>
        )
    }

  return (
    <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col w-[300px] justify-end">
            <input type="text"
            placeholder="Search destination or month..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
             />
        </div>
        <div className="overflow-auto">
            <table className='border-collapse'>
                <thead>
                    <tr>
                        <th className='table-cell'>Destination</th>
                        <th className='table-cell'>Month</th>
                        <th className='table-cell'>Weathe Info</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan={4} className='table-cell' >
                                <div className="flex flex-col justify-center items-center">
                                    <p className='font-[800] text-[13px] '>no available data</p>
                                </div>
                            </td>
                        </tr>
                    ): filteredData.map((d) => (
                        <React.Fragment key={d._id}>
                            <tr>
                                <td className='table-cell'>{destinations.find(ob => ob._id === d.destinationId)?.name}</td>
                                <td className='table-cell'>{months.find(ob => ob.id === parseInt(d.month))?.name}</td>
                                <td className='table-cell'>{d.weatherInfo}</td>
                                <td className='table-cell'>
                                    <button
                                    onClick={() => handleEditOpen(d._id)}
                                    >{openEdit && openEditId === d._id ? "Close" : "Edit"}</button>
                                </td>
                                <td className='table-cell'>
                                    <button
                                    onClick={() => deleteData(d._id)}
                                    >Delete</button>
                                </td>
                            </tr>
                            {openEdit && openEditId === d._id && (
                                <tr>
                                    <td colSpan={5} className='table-cell'>
                                        <div className="">
                                            <form onSubmit={handleSubmitEdit} 
                                                className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                <div className="flex flex-col">
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                                                    Weather Info
                                                </label>
                                                <select name="month" id="month"
                                                value={editObject?.month}
                                                onChange={(e) => setEditObject(editObject ? {...editObject, month: e.target.value}: null)}
                                                className='input'
                                                >
                                                    {months.map((m) => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                                </div>
                                                <div className="flex flex-col">
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                                                    Weather Info
                                                </label>
                                                <textarea name="weatherInfo" id="waetherInfo"
                                                value={editObject?.weatherInfo}
                                                onChange={(e) => setEditObject(editObject ? {...editObject, weatherInfo: e.target.value}: null)}
                                                className='input w-full'
                                                >
                                                </textarea>
                                                </div>
                                                <div className="flex flex-row w-[100%]">
                                                <button
                                                    className="bg-lightDark hover:bg-[#3C4048] text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
  )
}

export default page