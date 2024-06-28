"use client"
import React, { useEffect, useState } from "react";
import {  IDestinationList, IHolidayBlogList } from "@/(types)/type";
import { getDestinations } from "@/utils/(apis)/destinationApi";
import toast from "react-hot-toast";
import { months } from "@/lib/months";

interface PreviewModalProps {
  show: boolean;
  data: IHolidayBlogList;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ show, data, onClose }) => {
  if (!show) return null;

  const [destinations, setDestinations] = useState<IDestinationList[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error: any) {
        toast.error(error.message);
      } 
    };

    fetchData();
  }, [setDestinations]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto ">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity " onClick={onClose}></div>
      <div className="bg-white max-w-full w-[800px] mx-5   rounded-[3px] shadow-xl overflow-auto z-[20] h-[85vh]">
        <div className="flex justify-between items-center px-6 py-4 bg-lightDark text-white">
          <h2 className="text-lg font-semibold">Blog</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="mt-4">
            <div className="flex flex-row items-center gap-[5px] mb-4">
                <h2 className="font-[600] text-dark">Category:</h2>
                <p className="text-gray-700 text-sm ">{data?.category}</p>
            </div>
            {data?.month !== null && (
                <div className="flex flex-row items-center gap-[5px] mb-4">
                    <h2 className="font-[600] text-dark">Month:</h2>
                    <p className="text-gray-700 text-sm ">{data?.month !== null && months.find(m => m.id === parseInt(data?.month as string))?.name}</p>
                </div>
            )}
            
            <div className="flex flex-col gap-[5px]">
                <h2 className="font-[600] text-dark">Heading</h2>
                <p className="text-gray-700 text-sm mb-4">{data?.heading}</p>
            </div>
            <div className="flex flex-col gap-[5px]">
                <h2 className="font-[600] text-dark">Info</h2>
                <p className="text-gray-700 text-sm mb-4">{data?.info}</p>
            </div>
            <div className="flex justify-center mb-4">
                <img src={data?.image} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
            <div className="flex flex-col gap-[5px] px-[10px]">
                <h2 className="font-[600] text-dark">Contents</h2>
                    <ol className="list-decimal">
                        {data.content.map((c, index) => (
                            <li key={index}>
                                <div className="">
                                    <p className="text-gray-700 text-sm mb-4 border-b-[#ddd] border-b-[1px] pb-[5px]">{c.text}</p>
                                </div>
                            </li>
                        )) }
                    </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
