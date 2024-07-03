"use client"

import React, { useEffect, useState } from 'react';
import { IDestinationList } from '@/(types)/type';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import toast from 'react-hot-toast';
import Loading from './loading';

const Page:React.FC  = () => {

    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openEditId, setOpenEditId] = useState<string | null>(null);
  
    useEffect(() => {
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
  
      fetchData();
    }, [setDestinations, setError]);

    useEffect(() => {
      if (error) {
          toast.error(error);
      }
  }, [error]);

  //handle open edit

  const handleOpenEdit = (id: string) => {
    setOpenEdit(true);
    setOpenEditId(id);
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="flex flex-row justify-center">
        <div className="flex flex-col">
            {destinations.length === 0 ? (
                <div className="">
                    <p>no available destiations</p>
                </div>
            ):(
                <table className='border-collapse w-full'>
                    <thead>
                        <tr>
                            <th className='table-cell'>Name</th>
                            {/* <th className='table-cell'>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((d) => (
                          <React.Fragment key={d._id}>
                            <tr>
                                <td  className='table-cell'>{d.name}</td>
                                {/* <td  className='table-cell'>
                                  <button
                                  onClick={() => handleOpenEdit(d._id)}
                                  className="bg-lightDark hover:bg-dark text-white px-3 py-1 rounded-[2px]"
                                  >
                                    Edit
                                  </button>
                                </td> */}
                            </tr>
                            {openEdit && openEditId === d._id && (
                              <tr>
                                  <td colSpan={2}>
                                    <input type="text" value={d.name} />
                                    <button >Save</button>
                                  </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}

export default Page;
