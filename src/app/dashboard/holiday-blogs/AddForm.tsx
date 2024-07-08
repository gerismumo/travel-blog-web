"use client"

import { IDestinationList, IHolidayBlog, IInfoContent, ISelectedDestination, ISuccessFormProp } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { destiationCategory } from '@/lib/destiCategory';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';



const AddForm:React.FC<ISuccessFormProp> = ({onSuccess}) => {
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [category, setCategory] = useState<string>("");
    const [coverImage, setCoverImage] = useState<string>("");
    const [overViewH, setOverViewH] = useState<string>("");
    const [heading, setHeading] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [month, setMonth] = useState<string>("");
    const [metaTitle, setMetaTitle] = useState<string>("");
    const [metaDescription, setMetaDescription] = useState<string>("");
    const [metaKeywords, setMetaKeywords] = useState<string>("");
    const [selectedDestinations, setSelectedDestinations] = useState<ISelectedDestination[]>([]);
    const [Info, setInfo] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [othercategory, setOtherCategory] = useState<string>("");

    const [subContents, setSubContents] = useState<IInfoContent[]>([])

    const handleAddContents = () => {
      setSubContents([...subContents, { destination: '', subHeading: '', subImage: '', subDescription: '' }]);
    }

    const handleContentsChange = (
      index: number,
      field: keyof IInfoContent,
      value: string
    ) => {
      const updatedInfoContents = [...subContents];
      updatedInfoContents[index][field] = value;
      setSubContents(updatedInfoContents);
    };
   
    const handleDeleteContent = (index: number) => {
      setSubContents(subContents.filter((_, i) => i!== index));
    }


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

        if(!category || !overViewH || !coverImage  || !metaTitle || !metaDescription || !metaKeywords || (othercategory === "month" && selectedDestinations.length === 0)  ) {
          return toast.error("fill required fields");
        }

        const data: IHolidayBlog = {
          category: category,
          overViewHeading: overViewH, 
          coverImage: coverImage,
          heading:heading,
          image: image,
          overViewDescription:Info,
          metaTitle: metaTitle,
          metaDescription: metaDescription,
          metaKeyWords: metaKeywords,
          destination: category === "WEATHER" ? destination: null,
          otherCategory: othercategory? othercategory: null,
          month: othercategory === "month" ? month : null,
          OtherHolidayContent: othercategory === "month" ? [] : subContents,
          WeatherHolidayContent:selectedDestinations
      };


      //submit to database

      try {
        const response = await axios.post('/api/holiday-blog', data);
        if(response.data.success) {
          onSuccess();
          toast.success(response.data.message);
          setCategory("");
          setOverViewH("");
          setHeading("");
          setImage("");
          setMonth('');
          setInfo('');
          setCoverImage('');
          setMetaDescription('');
          setMetaTitle('');
          setMetaKeywords('');
          setSelectedDestinations([]);
          setSubContents([]);
          setOtherCategory("other");
          setDestination("");
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
    <div className="w-[100%] flex flex-col">
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            <div className="flex flex-col">
              <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="category" id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='input w-full'
              >
                <option value="">select</option>
                {destiationCategory.map((c, index) => (
                  <option key={index} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            {category === "WEATHER" && (
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Destinations <span className="text-red-500">*</span>
                </label>
                <select name="destination" id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className='input w-full'  
                
                >
                    <option value="">select</option>
                    {destinations.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                </select>
            </div>
            )}
            {category === "WHERE TO GO ON VACATION" && (
              <>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                  Sub Category <span className="text-red-500">*</span>
                </label>
                <select name="otherCategory" id="otherCategory"
                value={othercategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                className='input w-full'
                >
                  <option value="other">Other</option>
                  <option value="month">Month (Weather Data)</option>
                </select>
              </div>
              {othercategory === "month" && (
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
              </>
            )}
            
            <div className="flex flex-col">
              <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                Overview Heading <span className="text-red-500">*</span>
              </label>
              <textarea name="overViewH" id="overViewH"
              value={overViewH}
              onChange={(e) => setOverViewH(e.target.value)}
              className='input'
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                Cover Image <span className="text-red-500">*</span>
              </label>
              <input type="url" name="coverImage" id="coverImage" 
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder='image url'
              className='input'
              />
            </div>
            {category !== "WEATHER" && (
              <>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                  Heading <span className="text-red-500">*</span>
                </label>
                <textarea name="heading" id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className='input'
                ></textarea>
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
              </>
            )}
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Overview Description <span className="text-red-500">*</span>
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
                    Meta Title
                </label>
                <textarea name="monthInfo" id="monthInfo"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className='input'
                >

                </textarea>
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Meta Description
                </label>
                <textarea name="monthInfo" id="monthInfo"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className='input'
                >

                </textarea>
            </div>
            <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                    Meta Keywords
                </label>
                <textarea name="monthInfo" id="monthInfo"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className='input'
                >
                </textarea>
            </div>
            {category !== "WEATHER" && othercategory !== "month" && (
              <>
              <div className="flex flex-col justify-end">
                <button
                onClick={() => handleAddContents()}
                type="button"
                className='bg-lightDark hover:bg-dark text-white px-[20px] py-[6px] rounded-[6px]'
                >Add Content</button>
              </div>
              {subContents.map((s, index) => (
                <div key={index} className="flex flex-col border-[1px] border-[#ddd] p-[20px]">
                  <div className="flex flex-row justify-end">
                    <button
                    onClick={(e) => handleDeleteContent(index)}
                    type='button'
                    className='bg-red-400 px-[15px] py-[5px] rounded-[4px] text-white'
                    >Delete</button>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                        Destination
                    </label>
                    <select name="destination" id="destination"
                    className='input w-full'  
                        value={s.destination}
                        onChange={(e) => handleContentsChange(index, 'destination', e.target.value)}
                    >
                        <option value="">select</option>
                        {destinations.map((d) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                        Heading
                    </label>
                    <textarea name="subHeading" id="subHeading"
                    value={s.subHeading}
                    onChange={(e) => handleContentsChange(index, 'subHeading', e.target.value)}
                    className='input'
                    ></textarea>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                        image
                    </label>
                    <input type="url" name="subImage" id="subImage" 
                    value={s.subImage}
                    onChange={(e) => handleContentsChange(index,'subImage', e.target.value)}
                    className='input'
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
                        Description
                    </label>
                    <textarea name="subDescription" id="subDescription"
                    value={s.subDescription}
                    onChange={(e) => handleContentsChange(index, 'subDescription', e.target.value)}
                    className='input'
                    ></textarea>
                  </div>
                </div>
              ))}
              </>
            )}
            {category === "WHERE TO GO ON VACATION" && othercategory === "month" && (
              <div className='border-[1px] border-[#ddd] p-[20px]'>
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
                {selectedDestinations.length > 0 && (
                  <h2 className="block text-gray-700 text-sm font-bold " >Selected Destinations:</h2>
                )}
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
              </div>
            )}
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