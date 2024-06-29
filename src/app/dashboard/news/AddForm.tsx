"use client";

import { INews, ISubNews, ISuccessFormProp } from '@/(types)/type';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';



const AddForm: React.FC<ISuccessFormProp> = ({onSuccess}) => {
  const [heading, setHeading] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [metaKeywords, setMetaKeywords] = useState<string>("");
  const [subNews, setSubNews] = useState<ISubNews[]>([
    { subHeading: '', subImage: '', subText: '' },
  ]);

  const handleAddSubNews = () => {
    setSubNews([...subNews, { subHeading: '', subImage: '', subText: '' }]);
  };

  const handleSubNewsChange = (
    index: number,
    field: keyof ISubNews,
    value: string
  ) => {
    const updatedSubNews = [...subNews];
    updatedSubNews[index][field] = value;
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
  
    const data: INews = {
      heading,
      image,
      info,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      metaKeyWords: metaKeywords,
      subNews: subNews.map((sub) => ({
        subHeading: sub.subHeading,
        subImage: sub.subImage,
        subText: sub.subText,
      })),
    }

    try{
      const response = await axios.post(`/api/news`, data);
      if(response.data.success) {
        onSuccess();
        toast.success(response.data.message);
        setHeading('');
        setImage('');
        setInfo('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaKeywords('');
        setSubNews([
          { subHeading: '', subImage: '', subText: '' },
        ]);
      }else {
        toast.error(response.data.message);
      }
    }catch(error: any) {
      toast.error('network error');
    }

  };

  return (
    <div className="w-[100%]">
      <form onSubmit={handleSubmit}
      className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
          <input
            type="url"
            className="input"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

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
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">Sub-Image URL</label>
              <input
                type="url"
                className="input"
                value={sub.subImage}
                onChange={(e) => handleSubNewsChange(index, 'subImage', e.target.value)}
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
            className="bg-lightDark hover:bg-dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
