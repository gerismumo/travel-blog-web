"use client";

import { IDestinationList, IWeatherBlogList } from '@/(types)/type';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AddForm from './AddForm';

const page = () => {
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [openEdit , setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [openAddForm, setOpenAddForm] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false); 
    const [previewContent, setPreviewContent] = useState<IWeatherBlogList | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingDestination, setLoadingDestination] = useState<boolean>(true);


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
            // fetchData();
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
        {openAddForm && <AddForm/>}
    </div>
  )
}

export default page