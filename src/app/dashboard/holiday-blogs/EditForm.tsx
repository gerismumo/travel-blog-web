import { IDestinationList, IHolidayBlogList, IInfoContent } from '@/(types)/type';
import Spinner from '@/app/components/Spinner';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface EditFormProps {
    data: IHolidayBlogList | null;
    fetchData: () => void;
    closeForm: (value: boolean) => void;
}

const EditForm: React.FC<EditFormProps> = ({ data, fetchData, closeForm }) => {
    // console.log('edit data', data);
    
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loadingDestination, setLoadingDestination] = useState<Boolean>(true);

    const [formData, setFormData] = useState<IHolidayBlogList | null>(data);
    const [initialData, setInitialData] = useState<IHolidayBlogList | null>(data);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDestinations();
            setDestinations(data);
          } catch (error: any) {
            toast.error(error.message);
          } finally {
            setLoadingDestination(false);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        setInitialData(data);
        setFormData(data);
      }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => prevState ? { ...prevState, [name]: value } : prevState);
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            setFormData(prevState => {
                if (!prevState) return prevState;
                const updatedDestinations = [...prevState.WeatherHolidayContent];
                if (updatedDestinations.some((d) => d.destination === value)) {
                    toast.error('This destination is already selected.');
                    return prevState;
                }
                updatedDestinations.push({ destination: value, text: '' });
                return { ...prevState, WeatherHolidayContent: updatedDestinations };
            });
        }
    };
    

    const handleTextChange = (id: string, newText: string) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const updatedDestinations = prev.WeatherHolidayContent.map((dest) =>
                dest.destination === id ? { ...dest, text: newText } : dest
            );
            return { ...prev, WeatherHolidayContent: updatedDestinations };
        });
    };

    const removeDestination = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        setFormData((prev) => {
            if(!prev) return prev;
            const updatedDestinations = prev.WeatherHolidayContent.filter((dest) => dest.destination!== id);
            return {...prev, WeatherHolidayContent: updatedDestinations };
        })
      };
    
    const handleAddContents = () => {
        if (formData) {
            setFormData({
                ...formData,
                OtherHolidayContent: [...formData.OtherHolidayContent, { destination: '', subHeading: '', subImage: '', subDescription: '' }]
            });
        }
    };

    const handleDeleteContent = (index: number) => {
        if (formData) {
            const updatedContents = formData.OtherHolidayContent.filter((_, i) => i !== index);
            setFormData({ ...formData, OtherHolidayContent: updatedContents });
        }
    };

    const handleOtherHolidayContentChange = (index: number, name: keyof IInfoContent, value: string) => {
        if (formData) {
            const updatedContents = [...formData.OtherHolidayContent];
            updatedContents[index][name] = value;
            setFormData({ ...formData, OtherHolidayContent: updatedContents });
        }
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData === null) {
            toast.error("no available data");
            return;
          }
  
          const updatedData = new FormData();
          updatedData.append('_id',formData._id)
          updatedData.append('category', formData.category);
          updatedData.append('overViewHeading', formData.overViewHeading);
          updatedData.append('coverImage', formData.coverImage as File | string); 
          updatedData.append('heading', formData.heading);
          updatedData.append('image', formData.image as File | string); 
          updatedData.append('overViewDescription', formData.overViewDescription);
          updatedData.append('metaTitle', formData.metaTitle);
          updatedData.append('metaDescription', formData.metaDescription);
          updatedData.append('metaKeyWords', formData.metaKeyWords);
          updatedData.append('destination', formData.destination as any);
          updatedData.append('otherCategory', formData.otherCategory as any);
          updatedData.append('month', formData.month as any);
          updatedData.append('WeatherHolidayContent', formData.WeatherHolidayContent as any);
          
          formData.OtherHolidayContent?.length > 0 && formData.OtherHolidayContent.forEach((c, index) => {
            updatedData.append(`OtherHolidayContent[${index}].destination`, c.destination);
            updatedData.append(`OtherHolidayContent[${index}].subHeading`, c.subHeading);
            updatedData.append(`OtherHolidayContent[${index}].subImage`, c.subImage as File || String || null );
            updatedData.append(`OtherHolidayContent[${index}].subDescription`, c.subDescription);
          });

          setIsLoading(true)
          try {
            const response = await axios.put(`/api/holiday-blog/${formData._id}`, updatedData);
            if(response.data.success) {
              toast.success(response.data.message);
              fetchData();
              closeForm(false);
              setIsLoading(false)
              return;
            }else {
              toast.error(response.data.message);
              return;
            }
          }catch(error) {
            toast.error("network error")
          }finally {
            setIsLoading(false)
          }
    };

    if (!formData) {
        return <div>No data available</div>;
    }

    return (
        <div className="w-[100%] flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* {formData.category === "WEATHER" && (
                    <div className="flex flex-col">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="destination">
                            Destinations <span className="text-red-500">*</span>
                        </label>
                        <select name="destination" id="destination"
                            value={formData.destination || ''}
                            onChange={handleInputChange}
                            className='input w-full'>
                            <option value="">select</option>
                            {destinations.map((d) => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                )} */}
                {/* {formData.otherCategory && formData.category === "WHERE TO GO ON VACATION" && (
                    <>
                        <div className="flex flex-col">
                            <label className="block text-gray-700 text-sm font-bold" htmlFor="otherCategory">
                                Sub Category <span className="text-red-500">*</span>
                            </label>
                            <select name="otherCategory" id="otherCategory"
                                value={formData.otherCategory || ''}
                                onChange={handleInputChange}
                                className='input w-full'>
                                <option value="other">Other</option>
                                <option value="month">Month (Weather Data)</option>
                            </select>
                        </div>
                        {formData.otherCategory === "month" && (
                            <div className="flex flex-col">
                                <label className="block text-gray-700 text-sm font-bold" htmlFor="month">
                                    Month <span className="text-red-500">*</span>
                                </label>
                                <select name="month" id="month"
                                    className='input w-full'
                                    value={formData.month || ''}
                                    onChange={handleInputChange}>
                                    <option value="">select month</option>
                                    {months.map((month) => (
                                        <option key={month.id} value={month.id}>{month.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </>
                )} */}
                {initialData?.overViewHeading && (
                    <div className="flex flex-col">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="overViewHeading">
                            Overview Heading <span className="text-red-500">*</span>
                        </label>
                        <textarea name="overViewHeading" id="overViewHeading"
                            value={formData.overViewHeading}
                            onChange={handleInputChange}
                            className='input'></textarea>
                    </div>
                )}
                {initialData?.coverImage && (
                    <div className="flex flex-col">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="coverImage">
                            Cover Image <span className="text-red-500">*</span>
                        </label>
                        <input type="file" name="coverImage" id="coverImage"
                        accept='image/*'
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target && target.files && target.files[0]) {
                              setFormData({ ...formData, coverImage: target.files[0] });
                            }
                          }}
                        className='input'
                        />
                    </div>
                )}
                {initialData?.heading && (
                    <div className="flex flex-col">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="overViewHeading">
                            Heading <span className="text-red-500">*</span>
                        </label>
                        <textarea name="heading" id="heading"
                            value={formData.heading}
                            onChange={handleInputChange}
                            className='input'></textarea>
                    </div>
                )}
                {initialData?.image && (
                    <div className="flex flex-col">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="coverImage">
                            Image <span className="text-red-500">*</span>
                        </label>
                        <input type="file" name="image" id="image"
                        accept='image/*'
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target && target.files && target.files[0]) {
                              setFormData({ ...formData, image: target.files[0] });
                            }
                          }}
                        className='input'
                        />
                    </div>
                )}
                {initialData?.overViewDescription && (
                    <div className="flex flex-col">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="overViewDescription">
                            Overview Description <span className="text-red-500">*</span>
                        </label>
                        <textarea name="overViewDescription" id="overViewDescription"
                            value={formData.overViewDescription}
                            onChange={handleInputChange}
                            className='input'></textarea>
                    </div>
                )}
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="metaTitle">
                        Meta Title
                    </label>
                    <textarea name="metaTitle" id="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        className='input'></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="metaDescription">
                        Meta Description
                    </label>
                    <textarea name="metaDescription" id="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        className='input'></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="metaKeyWords">
                        Meta Keywords
                    </label>
                    <textarea name="metaKeyWords" id="metaKeyWords"
                        value={formData.metaKeyWords}
                        onChange={handleInputChange}
                        className='input'></textarea>
                </div>
                {initialData?.category !== "WEATHER" && initialData?.otherCategory !== "month" && (
                    <>
                        <div className="flex flex-col justify-end">
                            <button
                                onClick={handleAddContents}
                                type="button"
                                className='bg-lightDark hover:bg-dark text-white px-[20px] py-[6px] rounded-[6px]'>
                                Add Content
                            </button>
                        </div>
                        {formData.OtherHolidayContent.map((s, index) => (
                            <div key={index} className="flex flex-col border-[1px] border-[#ddd] p-[20px]">
                                <div className="flex flex-row justify-end">
                                    <button
                                        onClick={() => handleDeleteContent(index)}
                                        type='button'
                                        className='bg-red-400 px-[15px] py-[5px] rounded-[4px] text-white'>
                                        Delete
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-gray-700 text-sm font-bold" htmlFor="destination">
                                        Destination
                                    </label>
                                    <select name="destination" id="destination"
                                        className='input w-full'
                                        value={s.destination}
                                        onChange={(e) => handleOtherHolidayContentChange(index, 'destination', e.target.value)}>
                                        <option value="">select</option>
                                        {destinations.map((d) => (
                                            <option key={d._id} value={d._id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-gray-700 text-sm font-bold" htmlFor="subHeading">
                                        Heading
                                    </label>
                                    <textarea name="subHeading" id="subHeading"
                                        value={s.subHeading}
                                        onChange={(e) => handleOtherHolidayContentChange(index, 'subHeading', e.target.value)}
                                        className='input'></textarea>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-gray-700 text-sm font-bold" htmlFor="subImage">
                                        Image
                                    </label>
                                    <input type="file" name="subImage" id="subImage"
                                    onChange={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        if (target && target.files && target.files[0]) {
                                          handleOtherHolidayContentChange(index, 'subImage', target.files[0]);
                                        }
                                      }}
                                     accept='image/*'
                                     className='input'
                                     />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-gray-700 text-sm font-bold" htmlFor="subDescription">
                                        Description
                                    </label>
                                    <textarea name="subDescription" id="subDescription"
                                        value={s.subDescription}
                                        onChange={(e) => handleOtherHolidayContentChange(index, 'subDescription', e.target.value)}
                                        className='input'></textarea>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {formData.category === "WHERE TO GO ON VACATION" && formData.otherCategory === "month" && (
                    <div className='border-[1px] border-[#ddd] p-[20px]'>
                        <div className="flex flex-col">
                            <label className="block text-gray-700 text-sm font-bold" htmlFor="destination">
                                Add Destinations <span className="text-red-500">*</span>
                            </label>
                            <select name="destination" id="destination"
                                className='input w-full'
                                onChange={(e) => handleDestinationChange(e)}>
                                <option value="">Destination contents</option>
                                {destinations.map((d) => (
                                    <option key={d._id} value={d._id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            {formData.WeatherHolidayContent.length > 0 && (
                                <h2 className="block text-gray-700 text-sm font-bold">Selected Destinations:</h2>
                            )}
                            <ul>
                                {formData.WeatherHolidayContent.map((selectedDest) => {
                                    const destination = destinations.find((d) => d._id === selectedDest.destination);
                                    return (
                                        <li key={selectedDest.destination} className="flex flex-col mt-2 border-[1px] border-[#ddd] rounded-[4px] p-[10px]">
                                            <div className="flex justify-between items-center">
                                                {destination?.name}
                                                <button
                                                    className="text-red-500"
                                                    onClick={(e) => removeDestination(e, selectedDest.destination)}
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
                        type="submit">
                        {isLoading ? <Spinner/> : "Edit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditForm;