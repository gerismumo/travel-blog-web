"use client"
import { IDestinationList, IPlaceToVisit, ISuccessFormProp, IThingsToDo } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';



const AddForm: React.FC<ISuccessFormProp> = ({onSuccess}) => {
    const [formData, setFormData] = useState<IThingsToDo>({
        destination: "",
        overviewHeading: "",
        overviewDescription: "",
        image: "",
        metaTitle: "",
        metaDescription: "",
        metaKeyWords: "",
        placesToVisit: []
    });

    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
            placesToVisit: [...formData.placesToVisit, { heading: "", description: "", image: "" }]
        });
    };

    const handlePlaceChange = (index: number, key: keyof IPlaceToVisit, value: string) => {
        const updatedPlaces = [...formData.placesToVisit];
        updatedPlaces[index][key] = value;
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
        try {
            const response = await axios.post('/api/things-to-do',formData );
            if(response.data.success) {
                onSuccess();
                toast.success(response.data.message);
                setFormData({
                    destination: "",
                    overviewHeading: "",
                    overviewDescription: "",
                    image: "",
                    metaTitle: "",
                    metaDescription: "",
                    metaKeyWords: "",
                    placesToVisit: []
                });
            }else {
                toast.error(response.data.message);
            }
        }catch(error) {
            toast.error("networ error")
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
            className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
                    <input
                        type="text"
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                            <input
                                type="text"
                                id={`placeImage${index}`}
                                value={place.image}
                                onChange={(e) => handlePlaceChange(index, 'image', e.target.value)}
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
                className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddForm;
