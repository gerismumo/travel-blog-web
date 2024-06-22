"use client"

import React, { useEffect, useState } from 'react';
import { IDestinationList } from '@/(types)/type';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import toast from 'react-hot-toast';
import Loader from '@/app/components/Loader';

const Page:React.FC  = () => {

    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
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

  if (loading) {
    return (
      <Loader/>
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
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((obj) => (
                            <tr key={obj._id}>
                                <td className='text-balck'>{obj.name}</td>
                                <td>Delete</td>
                                <td>Edit</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}

export default Page;
