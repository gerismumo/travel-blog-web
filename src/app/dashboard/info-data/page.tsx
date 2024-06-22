"use client"

import fontawesome from '@/(icons)/fontawesome';
import { IDestinationContentList, IDestinationList } from '@/(types)/type'
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import { truncateText } from '@/utils/service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {
    const[contentList, setContentList] = useState<IDestinationContentList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [openEdit , setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [editObject, setEditObject] = useState<IDestinationContentList | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
    const [loadingContent, setLoadingContent] = useState<boolean>(true);
    const [viewMore, setViewMore] = useState<{ [key: string]: boolean }>({});

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/content');
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
            setLoadingDestinations(false);
          }
        };
    
        fetchData();
      }, [setDestinations]);

      //delete data 
      const deleteData = async (id: string) => {
        try {
          const response = await axios.delete(`/api/content/${id}`);
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


        const data: IDestinationContentList = {
            _id: editObject._id,
            destinationId: editObject.destinationId,
            weatherInfo: editObject.weatherInfo,
            destinationInfo: editObject.destinationInfo,
            image: editObject.image
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
            const response = await axios.put(`/api/content/${editObject._id}`, data);
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
    const[filteredData, setFilteredData] = useState<IDestinationContentList[]>([])

    useEffect(() => {
        setFilteredData(
            contentList.filter((item) =>
                destinations.find((dest) => dest._id === item.destinationId)?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, contentList, destinations]);

    const handleViewMore = (id: string) => {
        setViewMore((prev) => ({ ...prev, [id]: !prev[id] }));
        setOpenEdit(false);
    };

    //loader
    if(loadingContent || loadingDestinations) {
        return (
            <Loader/>
        )
    }

  return (
    <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col w-[300px] justify-end">
            <input type="text"
            placeholder="Search destination..."
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
                        <th className='table-cell'>Weathe Info</th>
                        <th className='table-cell'>Destination Info</th>
                        <th className='table-cell'>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan={3} className='table-cell' >
                                <div className="flex flex-col justify-center items-center">
                                    <p className='font-[800] text-[13px] '>no available data</p>
                                </div>
                            </td>
                        </tr>
                    ): filteredData.map((d) => {
                            const weatherInfo = truncateText(d.weatherInfo, 100);
                            const destinationInfo = truncateText(d.destinationInfo, 100);
                        return(
                            <React.Fragment key={d._id}>
                                <tr>
                                    <td className='table-cell'>{destinations.find(ob => ob._id === d.destinationId)?.name}</td>
                                    <td className='table-cell'>
                                        {viewMore[d._id] ? d.weatherInfo : weatherInfo.text}
                                        {weatherInfo.truncated && (
                                            <button onClick={() => handleViewMore(d._id)}
                                             className='bg-lightDark text-white px-[15px] py-[4px] rounded-[4px]'
                                            >
                                                {viewMore[d._id] ? "View Less" : "View More"}
                                            </button>
                                        )}
                                    </td>
                                    <td className='table-cell'>
                                        {viewMore[d._id] ? d.destinationInfo : destinationInfo.text}
                                        {destinationInfo.truncated && (
                                            <button onClick={() => handleViewMore(d._id)}
                                            className='bg-lightDark text-white px-[15px] py-[4px] rounded-[4px]'
                                            >
                                                {viewMore[d._id] ? "View Less" : "View More"}
                                            </button>
                                        )}
                                    </td>
                                    <td className='table-cell'>
                                        <img src={d.image} alt="" 
                                        className='w-[70px] h-[70px] transition-transform duration-300 hover:absolute hover:z-10 hover:scale-125 hover:w-[150px] hover:h-[150px]'
                                        />
                                    </td>
                                    <td className='table-cell'>
                                        <button
                                        onClick={() => handleEditOpen(d._id)}
                                        >{openEdit && openEditId === d._id ? "Close" : "Edit"}</button>
                                    </td>
                                    <td className='table-cell'>
                                        <button
                                        onClick={() => deleteData(d._id)}
                                        className='text-[20px]'
                                        >
                                            <FontAwesomeIcon icon={fontawesome.faTrashCan}/>
                                        </button>
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
                                                    <textarea name="weatherInfo" id="waetherInfo"
                                                    value={editObject?.weatherInfo}
                                                    onChange={(e) => setEditObject(editObject ? {...editObject, weatherInfo: e.target.value}: null)}
                                                    className='input w-full'
                                                    >
                                                    </textarea>
                                                    </div>
                                                    <div className="flex flex-col">
                                                    <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                                                        Destination Info
                                                    </label>
                                                    <textarea name="weatherInfo" id="waetherInfo"
                                                    placeholder=''
                                                    value={editObject?.destinationInfo}
                                                    onChange={(e) => setEditObject(editObject ? {...editObject, destinationInfo: e.target.value}: null)}
                                                    className='input w-full'
                                                    >
                                                    </textarea>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                                                            Image Url
                                                        </label>
                                                        <input type="url" name="imageUrl" id="imageUrl"
                                                        value={editObject?.image}
                                                        onChange={(e) => setEditObject(editObject ? {...editObject, image: e.target.value}: null)}
                                                        className='input'
                                                        />
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
                        )
                    })
                    } 
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default page