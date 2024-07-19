"use client"
import React, { useEffect, useState } from "react";
import { IDestinationList,  IThingsToDoList } from "@/(types)/type";
import { getDestinations } from "@/utils/(apis)/destinationApi";
import toast from "react-hot-toast";
import ConfirmModal from "@/app/components/ConfirmModal";

interface PreviewModalProps {
  show: boolean;
  content: IThingsToDoList;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ show, content, onClose }) => {

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

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto ">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity " onClick={onClose}></div>
      <div className="bg-white max-w-full w-[800px] mx-5   rounded-[3px] shadow-xl overflow-auto z-[20] h-[65vh]">
        <div className="flex justify-between items-center px-6 py-4 bg-lightDark text-white">
          <h2 className="text-lg font-semibold">{destinations?.find(d => d._id ===content?.destination)?.name}</h2>
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
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Heading</h2>
                <p className="text-gray-700 text-sm mb-4">{content.overviewHeading}</p>
            </div>
            <div className="flex flex-col">
                <img src={content?.image as string} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Description</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.overviewDescription}</p>
            </div>
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Title</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.metaTitle}</p>
            </div>
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Description</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.metaDescription}</p>
            </div>
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta KeyWords</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.metaKeyWords}</p>
            </div>
            {content.placesToVisit.length > 0 && (
               <h2 className="font-[600] text-dark">Places to visit</h2> 
            )}
            {content.placesToVisit.map((p, index) => (
                <div key={index} className="flex flex-col">
                    <div className="flex flex-col ">
                        <h2 className="font-[600] text-dark">Heading</h2>
                        <p className="text-gray-700 text-sm mb-4">{p.heading}</p>
                    </div>
                    <div className="flex flex-col ">
                        <h2 className="font-[600] text-dark">Description</h2>
                        <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                    </div>
                    <div className="flex flex-col">
                        <img src={p.image as string} alt="" className="w-full h-auto max-h-96 object-cover" />
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PreviewModal;
