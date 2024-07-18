"use client";

import { INews, ISubNews, ISuccessFormProp } from '@/(types)/type';
import Spinner from '@/app/components/Spinner';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';



const AddForm: React.FC<ISuccessFormProp> = ({onSuccess}) => {
  const [heading, setHeading] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [info, setInfo] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [metaKeywords, setMetaKeywords] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [subNews, setSubNews] = useState<ISubNews[]>([
    { subHeading: '', subImage: null, subText: '' },
  ]);

  const handleAddSubNews = () => {
    setSubNews([...subNews, { subHeading: '', subImage: null, subText: '' }]);
  };

  const handleSubNewsChange = (
    index: number,
    field: keyof ISubNews,
    value: string | File | null
  ) => {
    const updatedSubNews = [...subNews];
    if (field === 'subImage') {
      updatedSubNews[index][field] = value as File | string | null;
    } else {
      updatedSubNews[index][field] = value as string;
    }
    setSubNews(updatedSubNews);
  };

  const handleDeleteSubNews = (index: number) => {
    const updatedSubNews = subNews.filter((_, i) => i !== index);
    setSubNews(updatedSubNews);
  };


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if(!heading || !image) {
      return toast('All fields are required');
    }

    // Handle form submission logic here
  

    const formData = new FormData();
    formData.append('heading', heading);
    formData.append('image', image);
    formData.append('info', info);
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);
    formData.append('metaKeyWords', metaKeywords);
    subNews.forEach((s, index) => {
      formData.append(`subNews[${index}].subHeading`, s.subHeading);
      formData.append(`subNews[${index}].subImage`, s.subImage as File || null);
      formData.append(`subNews[${index}].subText`, s.subText);
    })

    setIsLoading(true);
    try{
      const response = await axios.post(`/api/news`, formData);
      if(response.data.success) {
        onSuccess();
        toast.success(response.data.message);
        setHeading('');
        setImage(null);
        setInfo('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaKeywords('');
        setSubNews([
          { subHeading: '', subImage: '', subText: '' },
        ]);
        setIsLoading(false);
      }else {
        toast.error(response.data.message);
      }
    }catch(error: any) {
      toast.error('network error');
    }finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="w-[100%] flex flex-col">
      <form onSubmit={handleSubmit}
      className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]"
      >
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">Heading</label>
          <textarea name="heading" id="heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder='heading...'
          className='input'
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="file" name="image" id="image"
            accept='image/*'
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if(target && target.files && target.files[0]) {
                setImage(target.files[0]);
              }
            }}
            className="input"
            required
           />
        </div>
        {/* {typeof image === 'object' && image as File && (
          <div className="flex flex-col">
          <img src={URL.createObjectURL(image as File)} alt=""
          className='w-[200px] h-[100px] border-[1px] border-[#ddd] rounded-[6px] '
           />
        </div>
        )} */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">News Information</label>
          <textarea
            className="input"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <textarea name="metatitle" id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          className='input'
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea name="metaDescription" id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className='input'
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
          <textarea name="metaDescription" id="metaDescription"
          value={metaKeywords}
          onChange={(e) => setMetaKeywords(e.target.value)}
          className='input'
          ></textarea>
        </div>
        {subNews.map((sub, index) => (
          <div key={index} className="flex flex-col border-t border-gray-200 pt-4 relative mb-[20px]">
            <h2 className="text-xl font-semibold">Sub News {index + 1}</h2>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">Sub-Heading</label>
              <input
                type="text"
                className="input"
                value={sub.subHeading}
                onChange={(e) => handleSubNewsChange(index, 'subHeading', e.target.value)}
                accept='image/*'
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">Sub-Image URL</label>
              <input type="file" name="subImage" id="subImage"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                if(target && target.files && target.files[0]) {
                  handleSubNewsChange(index, 'subImage', target.files[0])
                }
              }} 
              className='input'
              required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">Sub-Text</label>
              <textarea
                className="input"
                value={sub.subText}
                onChange={(e) => handleSubNewsChange(index, 'subText', e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="absolute top-0 right-0 px-2 py-1 bg-red-500 text-white rounded-md"
              onClick={() => handleDeleteSubNews(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <div className="flex flex-col">
          <button
            type="button"
            className="bg-lightDark hover:bg-dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-[10px]"
            onClick={handleAddSubNews}
          >
            Add Another Sub News
          </button>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-lightDark hover:bg-dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLoading ? <Spinner/>: "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
