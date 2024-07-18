"use client"
import { IDestinationList, IPlaceToVisit, ISuccessFormProp, IThingsToDo } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import Spinner from '@/app/components/Spinner';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
    onSuccess: () => void;
    close: (value: boolean) => void;
}

const AddForm: React.FC<Props> = ({onSuccess, close}) => {
    const [formData, setFormData] = useState<IThingsToDo>({
        destination: "",
        overviewHeading: "",
        overviewDescription: "",
        image: null,
        metaTitle: "",
        metaDescription: "",
        metaKeyWords: "",
        placesToVisit: []
    });

    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const handleAddPlace = () => {
        setFormData({
            ...formData,
            placesToVisit: [...formData.placesToVisit, { heading: "", description: "", image: null }]
        });
    };

    const handlePlaceChange = (index: number, key: keyof IPlaceToVisit, value: string) => {
        const updatedPlaces = [...formData.placesToVisit];
        if(key === 'image') {
            updatedPlaces[index][key] = value as File | string | null;
        }else {
            updatedPlaces[index][key] = value as string;
        }
        setFormData({
            ...formData,
            placesToVisit: updatedPlaces
        });
    };

    const handleDeletePlace = (index: number) => {
        const updatedPlaces = [...formData.placesToVisit];
        updatedPlaces.splice(index, 1);
        setFormData({
            ...formData,
            placesToVisit: updatedPlaces
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !formData.destination ||
            !formData.overviewHeading ||
            !formData.overviewDescription ||
            !formData.image ||
            !formData.metaTitle ||
            !formData.metaDescription ||
            !formData.metaKeyWords ||
            formData.placesToVisit.some(
                (place) => !place.heading || !place.description || !place.image
            )
        ) {
            toast.error("All fields are required, including places to visit");
            return;
        }

        const Data = new FormData();
        Data.append("destination", formData.destination);
        Data.append("overviewHeading", formData.overviewHeading);
        Data.append("overviewDescription", formData.overviewDescription);
        Data.append("image", formData.image as File);
        Data.append("metaTitle", formData.metaTitle);
        Data.append("metaDescription", formData.metaDescription);
        Data.append("metaKeyWords", formData.metaKeyWords);

        formData.placesToVisit.forEach((p, index) => {
            Data.append(`placesToVisit[${index}].heading`, p.heading);
            Data.append(`placesToVisit[${index}].description`, p.description);
            Data.append(`placesToVisit[${index}].image`, p.image as File);
        })

        setIsLoading(true);
        try {
            const response = await axios.post('/api/things-to-do', Data);
            if(response.data.success) {
                onSuccess();
                toast.success(response.data.message);
                setFormData({
                    destination: "",
                    overviewHeading: "",
                    overviewDescription: "",
                    image: null,
                    metaTitle: "",
                    metaDescription: "",
                    metaKeyWords: "",
                    placesToVisit: []
                });
                setIsLoading(false);
                close(false);
            }else {
                toast.error(response.data.message);
            }
        }catch(error) {
            console.log(error);
            toast.error("networ error")
        }finally {
            setIsLoading(false);
        }
    }


    //loader
    if(loading) {
        return (
          <Loader/>
        )
      }

    return (
        <div className='w-[100%]'>
            <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
            >
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="destination">Destination</label>
                    <select name="destination" id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className='input'
                    >
                        <option value="">select</option>
                        {destinations.map((d) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="overviewHeading">Overview Heading</label>
                    <input
                        type="text"
                        id="overviewHeading"
                        value={formData.overviewHeading}
                        onChange={(e) => setFormData({ ...formData, overviewHeading: e.target.value })}
                        placeholder=''
                        className='input'
                    />
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="overviewDescription">Overview Description</label>
                    <textarea
                        id="overviewDescription"
                        value={formData.overviewDescription}
                        onChange={(e) => setFormData({ ...formData, overviewDescription: e.target.value })}
                        placeholder=''
                        className='input'
                    />
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="image">Image URL</label>
                    <input type="file" name="image" id="image" 
                        accept='image/*'
                        onChange={(e) => {
                            const target = e.target as any;
                            if(target && target.files && target.files[0]) {
                                setFormData({...formData, image: target.files[0] });
                            }
                        }}
                        className='input'
                    />
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="metaTitle">Meta Title</label>
                    <textarea name="metaTitle" id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className='input'
                    ></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="metaDescription">Meta Description</label>
                    <textarea name="metaDescription" id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value })}
                    className='input'
                    ></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="metaKeyWords">Meta Keywords</label>
                    <textarea name="metaKeyWords" id="metaKeyWords"
                    value={formData.metaKeyWords}
                    onChange={(e) => setFormData({...formData, metaKeyWords: e.target.value })}
                    className='input'
                    ></textarea>
                </div>
                {formData.placesToVisit.length > 0 && (
                    <div className="flex flex-col">
                        <span className="block text-gray-700 text-sm font-bold">Places to visit</span>
                    </div>
                )}
                {formData.placesToVisit.map((place, index) => (
                    <div className='flex flex-col border-[1px] border-[#ddd] rounded-[4px] p-[20px] ' key={index}>
                        <div className="flex flex-col">
                            <label className="block text-gray-700 text-sm font-bold" htmlFor={`placeHeading${index}`}>Heading:</label>
                            <input
                                type="text"
                                id={`placeHeading${index}`}
                                value={place.heading}
                                onChange={(e) => handlePlaceChange(index, 'heading', e.target.value)}
                                className='input'
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-gray-700 text-sm font-bold" htmlFor={`placeDescription${index}`}>Description:</label>
                            <textarea
                                id={`placeDescription${index}`}
                                value={place.description}
                                onChange={(e) => handlePlaceChange(index, 'description', e.target.value)}
                                className='input'
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-gray-700 text-sm font-bold" htmlFor={`placeImage${index}`}>Image URL:</label>
                            <input type="file" name="placeImage" id={`placeImage${index}`} 
                                accept='image/*'
                                onChange={(e) => {
                                    const target = e.target as any;
                                    if(target && target.files && target.files[0]) {
                                        handlePlaceChange(index, 'image', target.files[0])
                                    }
                                }}
                                className='input'
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleDeletePlace(index)}
                            className="bg-red-500 hover:bg-red-600 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                        >
                            Delete Place
                        </button>
                    </div>
                ))}

                <button 
                type="button" 
                onClick={handleAddPlace}
                className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Add Place
                </button>
                <button 
                type="submit"
                disabled={isLoading}
                className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                 {isLoading ? <Spinner/> : "Add"}
                </button>
            </form>
        </div>
    );
};

export default AddForm;
