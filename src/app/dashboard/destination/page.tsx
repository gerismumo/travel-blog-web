"use client"

import React, { useEffect, useState } from 'react';
import { IDestinationList } from '@/(types)/type';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import toast from 'react-hot-toast';
import Loading from './loading';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import Spinner from '@/app/components/Spinner';
import ConfirmModal from '@/app/components/ConfirmModal';
import AddForm from './AddForm';

const Page:React.FC  = () => {

    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [editObj, setEditObj] = useState<IDestinationList | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openAddForm, setOpenAddForm] = useState<boolean>(false);


    const fetchData = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error : any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      if (error) {
          toast.error(error);
      }
    }, [error]);

  //handle open edit

  

  const handleOpenEdit = (id: string) => {
    setOpenEdit(!openEdit);
    setOpenEditId(id);
    setEditObj(destinations.find(d => d._id === id) || null);
  };

  //submit edit
  const handleSubmitEdit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(editObj === null) {
      toast.error("no available data");
      return;
    }

    const data: IDestinationList = {
      _id: editObj._id,
      stationID: editObj.stationID,
      countryCode: editObj.countryCode,
      name: editObj.name,
    };

    for(const key in data) {
      if(!data[key as keyof IDestinationList]) {
        toast.error("all fields are required");
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await axios.put(`/api/destination/${editObj._id}`, data);
      if(response.data.success) {
        setOpenEdit(false);
        fetchData();
        toast.success(response.data.message);
        setIsLoading(false);
      } else {
        toast.error(response.data.message);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error("Network error");
    }finally{
      setIsLoading(false);
    }
  }


   //delete data 
   const deleteData = async (id: string) => {
    try {
      const response = await axios.delete(`/api/destination/${id}`);
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

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="flex flex-col gap-[30px]">
        <div className="flex flex-row justify-end">
          <button
          onClick={() => setOpenAddForm(!openAddForm)}
          type='button'
          className='px-[20px] py-[6px] rounded-[4px] bg-lightDark hover:bg-dark text-white'
          >
            {openAddForm ? "Close" : "Add New"}
          </button>
        </div>
        {openAddForm && <AddForm success={() => fetchData()} close={setOpenAddForm}/> }
        <div className="flex flex-col">
            {destinations.length === 0 ? (
                <div className="">
                    <p>no available destiations</p>
                </div>
            ):(
                <table className='border-collapse w-[100%]'>
                    <thead>
                        <tr>
                            <th className='table-cell'>Station ID</th>
                            <th className='table-cell'>Code</th>
                            <th className='table-cell'>Name</th>
                            <th className='table-cell'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((d) => (
                          <React.Fragment key={d._id}>
                            <tr>
                                <td className='table-cell'>{d.stationID}</td>
                                <td className='table-cell'>{d.countryCode}</td>
                                <td  className='table-cell'>{d.name}</td>
                                <td  className='table-cell'>
                                  <div className="flex flex-row items-center justify-center gap-[30px]">
                                    <button
                                    type='button'
                                    onClick={() => handleOpenEdit(d._id)}
                                    className="bg-lightDark hover:bg-dark text-white px-3 py-1 rounded-[4px]"
                                    >
                                    {openEditId === d._id && openEdit ? "Close" : "Edit"} 
                                    </button>
                                    <button
                                    type='button'
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
                                  <td className='table-cell p-[10px]' colSpan={4}>
                                    <form 
                                    onSubmit={(e) => handleSubmitEdit(e)}
                                    className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
                                    >
                                      <div className="flex flex-col">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" 
                                        value={editObj?.name}
                                        onChange={(e) => setEditObj(editObj ? {...editObj, name: e.target.value}: null)}
                                        className='input'
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <label htmlFor="name">Country Code</label>
                                        <input type="text" value={editObj?.countryCode}
                                        onChange={(e) => setEditObj(editObj ? {...editObj, countryCode: e.target.value}: null)}
                                        className='input'
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <label htmlFor="name">Station ID</label>
                                        <input type="text" value={editObj?.stationID}
                                        onChange={(e) => setEditObj(editObj ? {...editObj, stationID: e.target.value}: null)}
                                        className='input'
                                        />
                                      </div>
                                      <button 
                                      type='submit'
                                      disabled={isLoading}
                                      className='w-[100%] p-[30px] py-[6px] rounded-[6px] text-white bg-lightDark hover:bg-darkBlue font-[600]'
                                      >
                                        {isLoading ? <Spinner/> : 'Edit'}
                                      </button>
                                    </form>
                                  </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        <ConfirmModal
        show={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this content?"
      />
    </div>
  );
}

export default Page;
