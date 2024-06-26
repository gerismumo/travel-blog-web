"use client"
import { IDestinationList, IHolidayBlogList } from '@/(types)/type';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AddForm from './AddForm';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import ConfirmModal from '@/app/components/ConfirmModal';
import PreviewModal from './PreviewModal';
import Loader from '@/app/components/Loader';

const page = () => {
  const [contentList, setContentList] = useState<IHolidayBlogList[]>([]);
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);
  const [openViewContents, setOpenViewContents] = useState<boolean>(false);
  const [openContentId, setOpenContentId] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<IDestinationList[]>([]);
  const [openEdit , setOpenEdit] = useState<boolean>(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [editObject, setEditObject] = useState<IHolidayBlogList | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false); 
  const [previewContent, setPreviewContent] = useState<IHolidayBlogList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  //fetech blogs data

  const fetchData = async () => {
    try{
      const response = await axios.get(`/api/holiday-blog`)
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
  },[]);

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

  //
  const handleViewContents = (id: string) => {
    setOpenViewContents(!openViewContents);
    setOpenContentId(id);
  }

  //delete
  const deleteData = async (id: string) => {
    try {
      const response = await axios.delete(`/api/holiday-blog/${id}`);
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

  const handleChangeDestinations = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (editObject && value) {
      setEditObject((prev) => {
        if (!prev) return prev; 
  
        const updatedContent = prev.content.map((dest) => ({ ...dest }));
  
        if (updatedContent.some((dest) => dest.destination === value)) {
          toast.error('This destination is already selected.');
          return prev;
        }
  
        const newDestination = {
          destination: value,
          text: `Where to go on holiday in ${prev.month && months.find(m => m.id === parseInt(prev.month as string))?.name}? ${value && destinations.find(d => d._id === value)?.name}`,
        };
  
        return {
          ...prev,
          content: [...updatedContent, newDestination],
        };
      });
    }
  };

  const handleTextChange = (id: string, newText: string) => {
    if(editObject) {
      setEditObject((prev) => {
        if (!prev) return prev; 
        const updatedContent = prev.content.map((dest) => (dest.destination === id? {...dest, text: newText } : dest));
        return {
         ...prev,
          content: updatedContent,
        };
      })
    }
  };

  const removeDestination = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (editObject) {
      setEditObject((prev) => {
        if (!prev) return prev; 
  
        const updatedContent = prev.content.filter((dest) => dest.destination !== id);
  
        return {
          ...prev,
          content: updatedContent,
        };
      });
    }
  };


  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editObject === null) {
      toast.error("no available data");
      return;
    }

    if(!editObject.heading || !editObject.info || !editObject.image || editObject.content.length === 0) {
      return toast.error("no available data");
    }

    const data: IHolidayBlogList ={
      _id: editObject._id,
      category: editObject.category,
      month: editObject.month,
      heading: editObject.heading,
      info: editObject.info,
      image: editObject?.image,
      content: editObject?.content
    }

    //
    try {
      const response = await axios.put(`/api/holiday-blog/${data._id}`, data);
      if(response.data.success) {
        toast.success(response.data.message);
        setOpenEdit(false);
        fetchData();
      }else {
        toast.error(response.data.message);
      }
    }catch(error) {
      toast.error("network error")
    }

  }

  const handlePreview = (content: IHolidayBlogList) => {
    setPreviewContent(content);
    setShowPreviewModal(true);
  };


  

  if(loading) {
    return (
      <Loader/>
    )
  }

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-row justify-between w-full items-end">
        <div className=""></div>
          {/* <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-[400px]"
          /> */}
          <div className="flex flex-row items-center gap-[30px]">
              <button
              onClick={() => {
                  setOpenAddForm(!openAddForm);
                  // setOpenEdit(false);
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
          <table className='border-collapse w-full'>
            <thead>
              <tr>
                <th className='table-cell'>Category</th>
                <th className='table-cell'>Heading</th>
                <th className='table-cell'>Info</th>
                <th className='table-cell'>Image</th>
                <th className='table-cell'>Content</th>
                <th className='table-cell'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentList.length === 0 ? (
                <tr>
                  <td colSpan={6}>no available data</td>
                </tr>
              ): contentList.map((d) => (
                <React.Fragment key={d._id}>
                  <tr>
                    <td className='table-cell'>{d.category} {d.month !== null && `- ${months.find(m => m.id ===parseInt(d.month as string))?.name}`}</td>
                    <td className='table-cell'>{d.heading}</td>
                    <td className='table-cell'>{d.info}</td>
                    <td className='table-cell'>
                      <img src={d.image} alt="" 
                      className='h-[70px] w-[70px]'
                      />
                    </td>
                    <td
                    className='table-cell'
                    >
                      <button
                      onClick={() => handleViewContents(d._id)}
                      className='px-[20px] py-[6px] rounded-[2px] text-white bg-lightDark hover:bg-dark'
                      >{openViewContents && openContentId === d._id ? "Close" : "View Content"}</button>
                    </td>
                    <td className='table-cell'>
                    <div className="flex flex-row justify-center gap-[30px]">
                      <button
                          onClick={() => handlePreview(d)} // Open preview modal on click
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
                  {openViewContents && openContentId === d._id && (
                    <tr>
                      <td colSpan={6} className='table-cell'>
                        <div className="flex flex-col gap-[10px] w-[100%] p-[30px]">
                          {d.content.map((c) => (
                            <div className="flex flex-col border-[#ddd] border-[1px] p-[20px] rounded-[6px]">
                              <h2 className='font-[600] text-dark'>{destinations.find(l => l._id === c.destination)?.name}</h2>
                              <p className='text-[14px]'>{c.text}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  {openEdit && openEditId === d._id && (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex flex-col">
                        <form 
                          onSubmit={handleSubmit}
                          className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                          >
                              {/* <div className="flex flex-col">
                                  <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                      Holiday category <span className="text-red-500">*</span>
                                  </label>
                                  <select name="holidayCategory" id="holidaycategory"
                                      value={editObject?.category}
                                      onChange={(e) => setEditObject(editObject ? {...editObject, category: e.target.value}: null)}
                                      className='input'
                                  >
                                      <option value="">select category</option>
                                      <option value="month">Month</option>
                                      <option value="other">Other</option>
                                  </select>
                              </div>
                              {editObject?.category === "month" && (
                                  <div className="flex flex-col">
                                      <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                          Month <span className="text-red-500">*</span>
                                      </label>
                                      <select name="month" id="month"
                                      className='input w-full'
                                        value={editObject.month !== null ? editObject.month : ''}
                                        onChange={(e) => setEditObject(editObject ? {...editObject, month: e.target.value}: null)}
                                      >
                                          <option value="">select month</option>
                                          {months.map((month) => (
                                              <option key={month.id} value={month.id}>{month.name}</option>
                                          ))}
                                      </select>
                                  </div>
                              )} */}
                              <div className="flex flex-col">
                                  <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                      Heading <span className="text-red-500">*</span>
                                  </label>
                                  <input type="text" name="heading" id="heading"
                                      value={editObject?.heading}
                                      onChange={(e) => setEditObject(editObject ? {...editObject, heading: e.target.value}: null)}
                                      placeholder='heading...'
                                      className='input'
                                  />
                              </div>
                              <div className="flex flex-col">
                                  <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                      Info <span className="text-red-500">*</span>
                                  </label>
                                  <textarea name="monthInfo" id="monthInfo"
                                  value={editObject?.info}
                                  onChange={(e) => setEditObject(editObject ? {...editObject, info: e.target.value}: null)}
                                  className='input'
                                  >

                                  </textarea>
                              </div>
                              <div className="flex flex-col">
                                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                  Image <span className="text-red-500">*</span>
                                </label>
                                <input type="url" name="image" id="image" 
                                value={editObject?.image}
                                onChange={(e) => setEditObject(editObject ? {...editObject, image: e.target.value}: null)}
                                placeholder='image url'
                                className='input'
                                />
                              </div>
                              <div className="flex flex-col">
                                  <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                                      Add Destinations <span className="text-red-500">*</span>
                                  </label>
                                  <select name="destination" id="destination"
                                  className='input w-full'  
                                      onChange={handleChangeDestinations}
                                  >
                                      <option value="">Destination contents</option>
                                      {destinations.map((d) => (
                                          <option key={d._id} value={d._id}>{d.name}</option>
                                      ))}
                                  </select>
                              </div>
                              <div className="flex flex-col">
                                  <h2 className="block text-gray-700 text-sm font-bold " >Selected Destinations:</h2>
                                  <ul>
                                      {editObject?.content.map((selectedDest) => {
                                          const destination = destinations.find((d) => d._id === selectedDest.destination);
                                          return (
                                          <li key={selectedDest.destination} className="flex flex-col mt-2 border-[1px] border-[#ddd] rounded-[4px] p-[10px]">
                                              <div className="flex justify-between items-center">
                                              {destination?.name}
                                              <button
                                                  className="text-red-500"
                                                  onClick={(e) => removeDestination(e,selectedDest.destination)}
                                              >
                                                  Remove
                                              </button>
                                              </div>
                                              <input
                                              type="text"
                                              className="input w-full mt-1"
                                              value={selectedDest.text}
                                              onChange={(e) => handleTextChange(selectedDest.destination, e.target.value)}
                                              />
                                          </li>
                                          );
                                      })}
                                  </ul>
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
          show={showPreviewModal} // Pass show prop
          data={previewContent} // Pass content prop
          onClose={() => setShowPreviewModal(false)} // Pass onClose prop
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