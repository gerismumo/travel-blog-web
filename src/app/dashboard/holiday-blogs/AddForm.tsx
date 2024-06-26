"use client"

import { IDestinationList, IHolidayBlog, ISelectedDestination, ISuccessFormProp } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';



const AddForm:React.FC<ISuccessFormProp> = ({onSuccess}) => {
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [holidayCategory, setHolidayCategory] = useState<string>("");
    const [month, setMonth] = useState<string>("");
    const [heading, setHeading] = useState<string>("");
    const [selectedDestinations, setSelectedDestinations] = useState<ISelectedDestination[]>([]);
    const [Info, setInfo] = useState<string>("");
    const [image, setImage] = useState<string>("");


    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDestinations();
            setDestinations(data);
          } catch (error : any) {
            toast.error(error.message);
          }finally{
            setLoading(false);
          }
        };
    
        fetchData();
      }, [setDestinations]);

      

      const handleChangeDestinations = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
          setSelectedDestinations((prev) => {
            if (prev.some((dest) => dest.destination === value)) {
              toast.error('This destination is already selected.');
              return prev;
            }
            return [...prev, { destination: value, text: `Where to go on holiday in ${month && months.find(m => m.id ===parseInt(month))?.name}? ${value && destinations.find(d => d._id === value)?.name}` }]; 
          });
        }
      };

      const handleTextChange = (id: string, newText: string) => {
        setSelectedDestinations((prev) =>
          prev.map((dest) => (dest.destination === id ? { ...dest, text: newText } : dest))
        );
      };
    
      const removeDestination = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        setSelectedDestinations((prev) => prev.filter((dest) => dest.destination !== id));
      };
    
      //hnadleSubmit
      const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!holidayCategory || holidayCategory === "month" && !month || !heading || !Info || !image || selectedDestinations.length === 0) {
          return toast.error("fill required fields");
        }

        const data: IHolidayBlog = {
          category: holidayCategory,
          month: holidayCategory === "month" ? month : null,
          heading: heading,
          info: Info,
          image: image,
          content: selectedDestinations
      };

      //submit to database

      try {
        const response = await axios.post('/api/holiday-blog', data);
        if(response.data.success) {
          onSuccess();
          toast.success(response.data.message);
          setHolidayCategory('');
          setMonth('');
          setHeading('');
          setInfo('');
          setImage('');
          setSelectedDestinations([]);
        }else {
          toast.error(response.data.message);
        }
      }catch (error) {
        console.log(error)
        return toast.error("network error");
      }
        
      }
      //

      if(loading) {
        return (
          <Loader/>
        )
      }

  return (
    <div className="max-w-xl mx-auto">
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Holiday category <span className="text-red-500">*</span>
                </label>
                <select name="holidayCategory" id="holidaycategory"
                    value={holidayCategory}
                    onChange={(e) => setHolidayCategory(e.target.value)}
                    className='input'
                >
                    <option value="">select category</option>
                    <option value="month">Month</option>
                    <option value="other">Other</option>
                </select>
            </div>
            {holidayCategory === "month" && (
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                        Month <span className="text-red-500">*</span>
                    </label>
                    <select name="month" id="month"
                    className='input w-full'
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        <option value="">select month</option>
                        {months.map((month) => (
                            <option key={month.id} value={month.id}>{month.name}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Heading <span className="text-red-500">*</span>
                </label>
                <input type="text" name="heading" id="heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder='heading...'
                    className='input'
                />
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Info <span className="text-red-500">*</span>
                </label>
                <textarea name="monthInfo" id="monthInfo"
                value={Info}
                onChange={(e) => setInfo(e.target.value)}
                className='input'
                >

                </textarea>
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                Image <span className="text-red-500">*</span>
              </label>
              <input type="url" name="image" id="image" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
                    {selectedDestinations.map((selectedDest) => {
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
  )
}

export default AddForm;