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
import { TruncateContent } from '@/utils/service';
import EditForm from './EditForm';

const Page = () => {
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
        const updatedContent = prev.OtherHolidayContent.map((dest) => (dest.destination === id? {...dest, text: newText } : dest));
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
  
        const updatedContent = prev.OtherHolidayContent.filter((dest) => dest.destination !== id);
  
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
      coverImage: editObject.coverImage,
      image: editObject?.image,
      metaTitle: editObject?.metaTitle,
      metaDescription: editObject?.metaDescription,
      metaKeyWords: editObject?.metaKeyWords,
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
                <th className='table-cell'>Cover Image</th>
                <th className='table-cell'>Over View Heading</th>
                <th className='table-cell'>Over View Description</th>
                <th className='table-cell'>Meta Title</th>
                <th className='table-cell'>Meta Description</th>
                <th className='table-cell'>Meta keywords</th>
                <th className='table-cell'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentList.length === 0 ? (
                <tr>
                  <td colSpan={9} className='table-cell'>
                    <div className="flex flex-row justify-center items-center">
                      no available data
                    </div>
                  </td>
                </tr>
              ): contentList.map((d) => (
                <React.Fragment key={d._id}>
                  <tr>
                    <td className='table-cell'>
                    {TruncateContent(`${d.category} ${d.month !== null ? `- ${months.find(m => m.id === parseInt(d.month as string))?.name}` : ''}`, 15)}
                    </td>
                    <td className='table-cell'>
                      <img src={d.coverImage} alt="" 
                      className='h-[50px] w-[50px]'
                      />
                    </td>
                    <td className='table-cell'>{d.overViewHeading && TruncateContent(d.overViewHeading, 15)}</td>
                    <td className='table-cell'>{d.overViewDescription && TruncateContent(d.overViewDescription, 15)}</td>
                    <td className='table-cell'>{d.metaTitle && TruncateContent(d.metaTitle, 15)}</td>
                    <td className='table-cell'>{d.metaDescription && TruncateContent(d.metaDescription, 15)}</td>
                    <td className='table-cell'>{d.metaTitle && TruncateContent(d.metaTitle, 15)}</td>
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
                  {/* {openViewContents && openContentId === d._id && (
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
                  )} */}
                  {openEdit && openEditId === d._id && (
                    <tr>
                      <td colSpan={8}>
                        <EditForm data={editObject || null} />
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

export default Page