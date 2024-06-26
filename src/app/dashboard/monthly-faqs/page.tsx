"use client"

import { IDestinationList, IDestionationMonthFaq, IDestionationMonthFaqList } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AddForm from './AddForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import ConfirmModal from '@/app/components/ConfirmModal';
import PreviewModal from './PreviewModal';

const page:React.FC = () => {
    const[contentList, setContentList] = useState<IDestionationMonthFaqList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [openEdit , setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [editObject, setEditObject] = useState<IDestionationMonthFaqList | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingDestination, setLoadingDestination] = useState<boolean>(true);
    const [loadingContent, setLoadingContent] = useState<boolean>(true);
    const [openAddForm, setOpenAddForm] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false); 
    const [previewContent, setPreviewContent] = useState<IDestionationMonthFaqList | null>(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/faq/month');
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
          const response = await axios.delete(`/api/faq/month/${id}`);
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

      const handleDelete = (id: string) => {
        setShowDeleteModal(true);
        setDeleteId(id);
      };
    
      const handleConfirmDelete = async () => {
        if (deleteId) {
          await deleteData(deleteId);
        }
        setShowDeleteModal(false);
      };
    
      const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
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


        const data: IDestionationMonthFaqList = {
            _id: editObject._id,
            destination: editObject.destination,
            month: editObject.month,
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
            const response = await axios.put(`/api/faq/month/${editObject._id}`, data);
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
    const[filteredData, setFilteredData] = useState<IDestionationMonthFaqList[]>([])

    useEffect(() => {
        setFilteredData(
            contentList.filter((item) =>
                destinations.find((dest) => dest._id === item.destination)?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                months.find((m) => m.id === parseInt(item.month))?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, contentList, destinations]);

    
    const handlePreview = (content: IDestionationMonthFaqList) => {
        setPreviewContent(content);
        setShowPreviewModal(true);
      };

    //loader
    if(loadingContent || loadingDestination) {
        return (
            <Loader/>
        )
    }

  return (
    <div className="flex flex-col gap-[20px]">
        <div className="flex flex-row justify-between w-full items-end">
          <input
            type="text"
            placeholder="Search destination or month"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-[400px]"
          />
          <div className="flex flex-row items-center gap-[30px]">
              <button
              onClick={() => {
                  setOpenAddForm(!openAddForm);
                  setOpenEdit(false);
              }}
              className="bg-lightDark hover:bg-dark text-white px-4 py-2 rounded mt-2"
              >
              {openAddForm ? "Close Add Form" : "Add New Info"}
              </button>
              <button
              className="bg-lightDark hover:bg-dark text-white px-4 py-2 rounded mt-2"
              >Publish</button>
          </div>
        </div>
        {openAddForm && <AddForm onSuccess={fetchData} />}
        <div className="overflow-auto">
            <table className='border-collapse w-[100%]'>
                <thead>
                    <tr>
                        <th className='table-cell'>Destination</th>
                        <th className='table-cell'>Month</th>
                        <th className='table-cell'>Question</th>
                        <th className='table-cell'>Answer</th>
                        <th className='table-cell'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className='table-cell' >
                                <div className="flex flex-col justify-center items-center">
                                    <p className='font-[800] text-[13px] '>no available data</p>
                                </div>
                            </td>
                        </tr>
                    ): filteredData.map((d) => (
                        <React.Fragment key={d._id}>
                            <tr>
                                <td className='table-cell'>{destinations?.find(ob => ob._id === d.destination)?.name}</td>
                                <td className='table-cell'>{months.find(m => m.id === parseInt(d.month))?.name}</td>
                                <td className='table-cell'>{d.question}</td>
                                <td className='table-cell'>{d.answer}</td>
                                <td className='table-cell'>
                                <div className="flex flex-row justify-center gap-[30px]">
                                        <button
                                            onClick={() => handlePreview(d)} 
                                            className="bg-blue-500 text-white px-3 py-1 rounded-[2px]"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => handleEditOpen(d._id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-[2px]"
                                        >
                                            {openEdit && openEditId === d._id ? "Close" : "Edit"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(d._id)} 
                                            className="text-red-600 text-2xl"
                                        >
                                            <FontAwesomeIcon icon={fontawesome.faTrashCan} />
                                        </button>
                                    </div>
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
                                                    value={editObject?.destination}
                                                    onChange={(e) => setEditObject(editObject ? {...editObject, destination: e.target.value}: null)}
                                                >
                                                    {destinations.map((d) => (
                                                        <option key={d._id} value={d._id}>{d.name}</option>
                                                    ))}
                                                </select>
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                                    Month
                                                </label>
                                                <select name="month" id="month"
                                                className='input w-full'
                                                    value={editObject?.month}
                                                    onChange={(e) => setEditObject(editObject ? {...editObject, month: e.target.value}: null)}
                                                >
                                                    {months.map((m) => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
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
        {/* Preview Modal */}
       {showPreviewModal && previewContent && (
            <PreviewModal
            show={showPreviewModal} 
            content={previewContent} 
            onClose={() => setShowPreviewModal(false)} 
            />
        )}
        {/* Confirm delete */}
      <ConfirmModal
        show={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this content?"
      />
    </div>
  )
}

export default page