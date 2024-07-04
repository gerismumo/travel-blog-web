"use client"

import React, { useEffect, useState } from 'react'
import AddForm from './AddForm'
import { INewsList, ISubNews } from '@/(types)/type';
import { getNews } from '@/utils/(apis)/newsApi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { TruncateContent } from '@/utils/service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import Loading from './loading';
import PreviewModal from './PreviewModal';
import ConfirmModal from '@/app/components/ConfirmModal';

const Page = () => {
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

  

  const handleSubNewsChange = (index: number, field: keyof ISubNews, value: string) => {
    if (!editObject) return;
    const updatedSubNews = [...editObject.subNews];
    updatedSubNews[index][field] = value;
    setEditObject({ ...editObject, subNews: updatedSubNews });
  };

  //submit edit
  const handleSubmitEdit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(editObject === null) {
      toast.error("no available data");
      return;
    }

    const data: INewsList = {
      _id: editObject._id,
      heading: editObject.heading,
      info: editObject.info,
      image: editObject.image,
      metaTitle: editObject.metaTitle,
      metaDescription: editObject.metaDescription,
      metaKeyWords: editObject.metaKeyWords,
      subNews: editObject.subNews
    }

    try {
      const response = await axios.put(`/api/news/${editObject._id}`, data);
        if (response.data.success) {
          toast.success(response.data.message);
          fetchData();
        } else {
          toast.error(response.data.message);
        }
    } catch (error) {
      toast.error('network error');
    } finally {
      setLoading(false);
    }
  }

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
              <th className="table-cell">Meta Title</th>
              <th className="table-cell">Meta Description</th>
              <th className="table-cell">Meta Keywords</th>
              <th className="table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentList.length === 0 ? (
            <td colSpan={7} className='table-cell' >
              <div className="flex flex-col justify-center items-center">
                  <p className='font-[800] text-[13px] '>no available data</p>
              </div>
            </td>
          ):contentList.map((d) => (
            <React.Fragment key={d._id}>
              <tr>
                <td className='table-cell'>{ d.heading && TruncateContent(d.heading, 15)}</td>
                <td className='table-cell'>
                  <img src={d.image} alt=""
                  className='w-[50px] h-[50px] '
                   />
                </td>
                <td className="table-cell">{d.info && TruncateContent(d.info, 15)}</td>
                <td className="table-cell">{d.metaTitle && TruncateContent(d.metaTitle, 15)}</td>
                <td className="table-cell">{d.metaDescription && TruncateContent(d.metaDescription, 15)}</td>
                <td className="table-cell">{d.metaKeyWords && TruncateContent(d.metaKeyWords, 15)}</td>
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
              {openEdit && openEditId === d._id && (
                <tr>
                  <td colSpan={7} className='table-cell'>
                    <div className="">
                      <form onSubmit={handleSubmitEdit}
                      className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" 
                      >
                        <div className="flex flex-col">
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Heading <span className="text-red-500">*</span>
                          </label>
                          <textarea name="weatherInfo" id="waetherInfo"
                          value={editObject?.heading}
                          onChange={(e) => setEditObject(editObject ? {...editObject, heading: e.target.value}: null)}
                          className='input w-full'
                          >
                          </textarea>
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Image 
                          </label>
                          <input type="text"
                          name="metaTitle" id="metaTitle"
                          value={editObject?.image} 
                          onChange={(e) =>
                              setEditObject(
                              editObject
                                  ? { ...editObject,image: e.target.value }
                                  : null
                              )
                          }
                          className='input'
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Info <span className="text-red-500">*</span>
                          </label>
                          <textarea name="weatherInfo" id="waetherInfo"
                          value={editObject?.info}
                          onChange={(e) => setEditObject(editObject ? {...editObject, info: e.target.value}: null)}
                          className='input w-full'
                          >
                          </textarea>
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Meta Title
                          </label>
                          <textarea name="weatherInfo" id="waetherInfo"
                          value={editObject?.metaTitle}
                          onChange={(e) => setEditObject(editObject ? {...editObject, metaTitle: e.target.value}: null)}
                          className='input w-full'
                          >
                          </textarea>
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Meta Description
                          </label>
                          <textarea name="weatherInfo" id="waetherInfo"
                          value={editObject?.metaDescription}
                          onChange={(e) => setEditObject(editObject ? {...editObject, metaDescription: e.target.value}: null)}
                          className='input w-full'
                          >
                          </textarea>
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Meta Keywords
                          </label>
                          <textarea name="weatherInfo" id="waetherInfo"
                          value={editObject?.metaKeyWords}
                          onChange={(e) => setEditObject(editObject ? {...editObject, metaKeyWords: e.target.value}: null)}
                          className='input w-full'
                          >
                          </textarea>
                        </div>
                        {editObject && editObject?.subNews.length > 0 && (
                          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                              Sub news 
                          </label>
                        )}
                        <div className="flex flex-col">
                          {editObject?.subNews.map((s,index) => (
                            <div key={index} className="">
                            <div className="flex flex-col">
                              <label className="block text-gray-700 text-sm font-bold" htmlFor={`subHeading-${index}`}>
                                Sub Heading
                              </label>
                              <textarea
                                name={`subHeading-${index}`}
                                id={`subHeading-${index}`}
                                value={s.subHeading}
                                onChange={(e) => handleSubNewsChange(index, 'subHeading', e.target.value)}
                                className="input w-full"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="block text-gray-700 text-sm font-bold" htmlFor={`subImage-${index}`}>
                                Sub Image
                              </label>
                              <input
                                type="text"
                                name={`subImage-${index}`}
                                id={`subImage-${index}`}
                                value={s.subImage}
                                onChange={(e) => handleSubNewsChange(index, 'subImage', e.target.value)}
                                className="input"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="block text-gray-700 text-sm font-bold" htmlFor={`subText-${index}`}>
                                Sub Text
                              </label>
                              <textarea
                                name={`subText-${index}`}
                                id={`subText-${index}`}
                                value={s.subText}
                                onChange={(e) => handleSubNewsChange(index, 'subText', e.target.value)}
                                className="input w-full"
                              />
                            </div>
                          </div>
                          ))}
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

export default Page