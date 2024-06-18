"use client"

import {  IDestinationList, IDestionationFaqList } from '@/(types)/type'
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {
    const[contentList, setContentList] = useState<IDestionationFaqList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [openEdit , setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [editObject, setEditObject] = useState<IDestionationFaqList | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/faq');
            if (response.data.success) {
                setContentList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('network error');
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
          }
        };
    
        fetchData();
      }, [setDestinations]);

      //delete data 
      const deleteData = async (id: string) => {
        try {
          const response = await axios.delete(`/api/faq/${id}`);
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


        const data: IDestionationFaqList = {
            _id: editObject._id,
            destinationId: editObject.destinationId,
            question: editObject.question,
            answer: editObject.answer,
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
            const response = await axios.put(`/api/faq/${editObject._id}`, data);
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
    const[filteredData, setFilteredData] = useState<IDestionationFaqList[]>([])

    useEffect(() => {
        setFilteredData(
            contentList.filter((item) =>
                destinations.find((dest) => dest._id === item.destinationId)?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, contentList, destinations]);

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
                        <th className='table-cell'>Question</th>
                        <th className='table-cell'>Answer</th>
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
                    ): filteredData.map((d) => (
                        <React.Fragment key={d._id}>
                            <tr>
                                <td className='table-cell'>{destinations.find(ob => ob._id === d.destinationId)?.name}</td>
                                <td className='table-cell'>{d.question}</td>
                                <td className='table-cell'>{d.answer}</td>
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
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                                    Destination
                                                </label>
                                                <select name="destination" id="destination"
                                                className='input w-full'
                                                    value={editObject?.destinationId}
                                                    onChange={(e) => setEditObject(editObject ? {...editObject, destinationId: e.target.value}: null)}
                                                >
                                                    <option value="">select destination</option>
                                                    {destinations.map((d) => (
                                                        <option key={d._id} value={d._id}>{d.name}</option>
                                                    ))}
                                                </select>
                                                </div>
                                                <div className="flex flex-col">
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="question">
                                                    Question
                                                </label>
                                                <textarea name="question" id="question"
                                                value={editObject?.question}
                                                onChange={(e) => setEditObject(editObject ? {...editObject, question: e.target.value}: null)}
                                                className='input w-full'
                                                >
                                                </textarea>
                                                </div>
                                                <div className="flex flex-col">
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                                                    Answer
                                                </label>
                                                <textarea name="answer" id="answer"
                                                placeholder=''
                                                value={editObject?.answer}
                                                onChange={(e) => setEditObject(editObject ? {...editObject, answer: e.target.value}: null)}
                                                className='input w-full'
                                                >
                                                </textarea>
                                                </div>
                                                <div className="flex flex-row w-[100%]">
                                                <button
                                                    className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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