"use client"

import React, { useEffect, useState } from 'react'
import AddForm from './AddForm'
import { INewsList } from '@/(types)/type';
import { getNews } from '@/utils/(apis)/newsApi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { TruncateContent } from '@/utils/service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import Loading from './loading';
import PreviewModal from './PreviewModal';
import ConfirmModal from '@/app/components/ConfirmModal';

const page = () => {
  const[contentList, setContentList] = useState<INewsList[]>([]);
  const [openEdit , setOpenEdit] = useState<boolean>(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [editObject, setEditObject] = useState<INewsList | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false); 
  const [previewContent, setPreviewContent] = useState<INewsList | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchData = async () => {
    try {
      const data = await getNews();
      setContentList(data);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchData();
  }, []);


  const deleteData = async (id: string) => {
    try {
      const response = await axios.delete(`/api/news/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('network error');
    }finally {
      setLoading(false);
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

  const handlePreview = (content: INewsList) => {
    setPreviewContent(content);
    setShowPreviewModal(true);
  };

  if(loading) {
    return (
      <Loading/>
    )
  }

  return (
   <div className="flex flex-col">
    <div className="flex flex-row justify-between w-full items-end">
        <input
        type="text"
        placeholder="Search destination..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input w-[400px]"
        />
        <div className="flex flex-row justify-center gap-[30px] items-center">
          <button
          onClick={() => {
              setOpenAddForm(!openAddForm);
              setOpenEdit(false);
          }}
          className="bg-lightDark hover:bg-dark text-white px-4 py-2 rounded "
          >
          {openAddForm ? "Close Add Form" : "Add New Info"}
          </button>
          <button
              className="bg-lightDark hover:bg-dark text-white px-4 py-2 rounded"
          >
              Publish
          </button>
        </div>
    </div>
        {openAddForm && <AddForm onSuccess={fetchData} />}
    <div className="overflow-auto mt-5">
      <table className='border-collapse w-full'>
        <thead>
          <tr>
              <th className='table-cell'>Heading</th>
              <th className='table-cell'>Image</th>
              <th className="table-cell">Info</th>
              <th className="table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentList.length === 0 ? (
            <td colSpan={4} className='table-cell' >
              <div className="flex flex-col justify-center items-center">
                  <p className='font-[800] text-[13px] '>no available data</p>
              </div>
            </td>
          ):contentList.map((d) => (
            <React.Fragment key={d._id}>
              <tr>
                <td className='table-cell'>{TruncateContent(d.heading, 40)}</td>
                <td className='table-cell'>
                  <img src={d.image} alt=""
                  className='w-[50px] h-[50px] '
                   />
                </td>
                <td className="table-cell">{TruncateContent(d.info, 40)}</td>
                <td className="table-cell">
                  <div className="flex flex-row justify-center gap-[30px] items-center">
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
                        onClick={() => handleDelete(d._id)} // Open modal on click
                        className="text-red-600 text-2xl"
                    >
                        <FontAwesomeIcon icon={fontawesome.faTrashCan} />
                    </button>
                  </div>
                </td>
              </tr>
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