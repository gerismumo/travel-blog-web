"use client"

import React, { useEffect, useState } from 'react'
import AddForm from './AddForm'
import { IDestinationList, IPlaceToVisit, IThingsToDoList } from '@/(types)/type';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TruncateContent } from '@/utils/service';
import fontawesome from '@/(icons)/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import PreviewModal from './PreviewModal';
import ConfirmModal from '@/app/components/ConfirmModal';

const Page:React.FC = () => {
  const[contentList, setContentList] = useState<IThingsToDoList[]>([]);
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [openEdit , setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [editObject, setEditObject] = useState<IThingsToDoList | null>(null);
    const [openAddForm, setOpenAddForm] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false); 
    const [previewContent, setPreviewContent] = useState<IThingsToDoList | null>(null);
    const [loadingDestination, setLoadingDestination] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);


    const fetchData = async () => {
      try{
        const response = await axios.get(`/api/things-to-do`)
        if(response.data.success) {
          setContentList(response.data.data);
        }else {
          toast.error(response.data.message);
        }
      }catch(error) {
        toast.error('network error')
      }finally{
        setLoading(false);
      }
    }

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
        const response = await axios.delete(`/api/things-to-do/${id}`);
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


     // Handle places to visit changes
  const handlePlaceChange = (index: number, key: keyof IPlaceToVisit, value: string) => {
    if (!editObject) return;
    const newPlacesToVisit = [...editObject.placesToVisit];
    newPlacesToVisit[index] = { ...newPlacesToVisit[index], [key]: value };
    setEditObject({ ...editObject, placesToVisit: newPlacesToVisit });
  };

  const handleDeletePlace = (index: number) => {
    if (!editObject) return;
    const newPlacesToVisit = editObject.placesToVisit.filter((_, i) => i !== index);
    setEditObject({ ...editObject, placesToVisit: newPlacesToVisit });
  };

  const handleAddPlace = () => {
    if (!editObject) return;
    const newPlace: IPlaceToVisit = { heading: '', description: '', image: '' };
    setEditObject({ ...editObject, placesToVisit: [...editObject.placesToVisit, newPlace] });
  };


    //edit
    const handleSubmitEdit = async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if(editObject === null) {
        toast.error("no available data");
        return;
      }

      const data: IThingsToDoList = {
        _id: editObject._id,
        destination: editObject.destination,
        overviewHeading: editObject.overviewHeading,
        overviewDescription: editObject.overviewDescription,
        image: editObject.image,
        metaTitle: editObject.metaTitle,
        metaDescription: editObject.metaDescription,
        metaKeyWords: editObject.metaKeyWords,
        placesToVisit: editObject.placesToVisit
      }

      try{
        const response = await axios.put(`/api/things-to-do/${editObject._id}`, data);

        if(response.data.success) {
          toast.success(response.data.message);
          setOpenEdit(false);
          fetchData();
        }else {
          toast.error(response.data.message);
        }

      }catch(error: any) {
        toast.error('network error')
      }
    }

    const[filteredData, setFilteredData] = useState<IThingsToDoList[]>([])

    useEffect(() => {
        setFilteredData(
            contentList.filter((item) =>
                destinations.find((dest) => dest._id === item.destination)?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, contentList, destinations]);

    
    const handlePreview = (content: IThingsToDoList) => {
        setPreviewContent(content);
        setShowPreviewModal(true);
      };

      if(loadingDestination || loading) {
        return (
          <Loader/>
        )
      }
  return (
    <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col sm:flex-row justify-between w-full xs:items-end">
          <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-[100%] xs:w-[350px]"
          />
          <div className="flex flex-col xs:flex-row items-center gap-[10px] xs:gap-[30px]">
              <button
              onClick={() => {
                  setOpenAddForm(!openAddForm);
                  setOpenEdit(false);
              }}
              className="w-[100%] xs:w-auto bg-lightDark hover:bg-dark text-white px-4 py-2 rounded mt-2"
              >
              {openAddForm ? "Close Add Form" : "Add New Info"}
              </button>
              <button
              className="w-[100%] xs:w-auto bg-lightDark hover:bg-dark text-white px-4 py-2 rounded mt-2"
              >Publish</button>
          </div>
        </div>
        {openAddForm && <AddForm onSuccess={fetchData} />}
        <div className="overflow-auto">
            <table className='border-collapse w-[100%]'>
                <thead>
                    <tr>
                        <th className='table-cell'>Destination</th>
                        <th className='table-cell'>Image</th>
                        <th className='table-cell'>Heading</th>
                        <th className='table-cell'>Description</th>
                        <th className='table-cell'>Meta Title</th>
                        <th className='table-cell'>Meta Description</th>
                        <th className='table-cell'>Meta Keywords</th>
                        <th className='table-cell'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan={8} className='table-cell' >
                                <div className="flex flex-col justify-center items-center">
                                    <p className='font-[800] text-[13px] '>no available data</p>
                                </div>
                            </td>
                        </tr>
                    ): filteredData.map((d) => (
                        <React.Fragment key={d._id}>
                            <tr>
                                <td className='table-cell'>{destinations?.find(ob => ob._id === d.destination)?.name}</td>
                                <td className='table-cell'>
                                  <img src={d.image} alt=""
                                  className='h-[50px] w-[50px]'
                                   />
                                </td>
                                <td className='table-cell'>{ d.overviewHeading && TruncateContent(d.overviewHeading, 15)}</td>
                                <td className='table-cell'>{d.overviewDescription && TruncateContent(d.overviewDescription, 15)}</td>
                                <td className='table-cell'>{d.metaTitle && TruncateContent(d.metaTitle, 15)}</td>
                                <td className='table-cell'>{d.metaDescription && TruncateContent(d.metaDescription, 15)}</td>
                                <td className='table-cell'>{d.metaKeyWords && TruncateContent(d.metaKeyWords, 15)}</td>
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
                                    <td colSpan={8} className='table-cell'>
                                        <div className="">
                                            <form onSubmit={handleSubmitEdit} 
                                                className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                
                                                <div className="flex flex-col">
                                                  <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                                      Heading
                                                  </label>
                                                  <textarea name="question" id="question"
                                                  value={editObject?.overviewHeading}
                                                  onChange={(e) => setEditObject(editObject ? {...editObject, overviewHeading: e.target.value}: null)}
                                                  className='input w-full'
                                                  >
                                                  </textarea>
                                                </div>
                                                <div className="flex flex-col">
                                                  <label className="block text-gray-700 text-sm font-bold " htmlFor="question">
                                                      Description
                                                  </label>
                                                  <textarea name="question" id="question"
                                                  value={editObject?.overviewDescription}
                                                  onChange={(e) => setEditObject(editObject ? {...editObject, overviewDescription: e.target.value}: null)}
                                                  className='input w-full'
                                                  >
                                                  </textarea>
                                                </div>
                                                <div className="flex flex-col">
                                                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                                                    Image
                                                </label>
                                                <input type="url" name="image" id="image"
                                                  value={editObject?.image}
                                                  onChange={(e) => setEditObject(editObject ? {...editObject, image: e.target.value}: null)}
                                                  className='input w-full'
                                                 />
                                                </div>
                                                <div className="flex flex-col">
                                                {editObject?.placesToVisit.map((place, index) => (
                                                  <div key={index} className="flex flex-col gap-[20px] w-full border-t border-lightGray pt-[20px]">
                                                    <div className="flex flex-row justify-between">
                                                      <button
                                                        type="button"
                                                        onClick={() => handleDeletePlace(index)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-[2px]"
                                                      >
                                                        Delete
                                                      </button>
                                                    </div>
                                                    <div className="flex flex-col ">
                                                      <label className="block text-gray-700 text-sm font-bold ">Heading</label>
                                                      <input
                                                        type="text"
                                                        value={place.heading}
                                                        onChange={(e) => handlePlaceChange(index, 'heading', e.target.value)}
                                                        className="input"
                                                      />
                                                    </div>
                                                    <div className="flex flex-col">
                                                      <label className="block text-gray-700 text-sm font-bold ">Description</label>
                                                      <textarea
                                                        value={place.description}
                                                        onChange={(e) => handlePlaceChange(index, 'description', e.target.value)}
                                                        className="input"
                                                      />
                                                    </div>
                                                    <div className="flex flex-col ">
                                                      <label className="block text-gray-700 text-sm font-bold ">Image</label>
                                                      <input
                                                        type="text"
                                                        value={place.image}
                                                        onChange={(e) => handlePlaceChange(index, 'image', e.target.value)}
                                                        className="input"
                                                      />
                                                    </div>
                                                  </div>
                                                ))}
                                                </div>
                                                <div className="flex flex-row justify-center w-full">
                                                    <button
                                                      type="button"
                                                      onClick={handleAddPlace}
                                                      className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                      Add New Place
                                                    </button>
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

export default Page