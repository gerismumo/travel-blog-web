"use client"
import React, { useEffect, useState } from "react";
import { IDestinationList, IDestionationMonthFaqList } from "@/(types)/type";
import { getDestinations } from "@/utils/(apis)/destinationApi";
import toast from "react-hot-toast";
import { months } from "@/lib/months";
import axios from "axios";

interface PreviewModalProps {
  show: boolean;
  content: IDestionationMonthFaqList;
  onClose: () => void;
  success: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ show, content, onClose, success }) => {

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


  const deleteFAQ = async (faqId: string, conId: string) => {
    try {
      const response = await axios.delete(`/api/faq/month/f/${faqId}`,{ data: { conId }} );
      if(response.data.success) {
        success()
        toast.success(response.data.message);
      }else {
        toast.error(response.data.message);
      }
      
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto ">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity " onClick={onClose}></div>
      <div className="bg-white max-w-full w-[800px] mx-5   rounded-[3px] shadow-xl overflow-auto z-[20] h-[70vh]">
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
                <h2 className="font-[600] text-dark">Month</h2>
                <p className="text-gray-700 text-sm mb-4">{months.find(m => m.id === parseInt(content?.month))?.name}</p>
            </div>
            <div className=" flex flex-col p-6 overflow-y-auto gap-[10px]  ">
            {content.faqs.map((f) => (
              <div key={f._id} className="flex flex-col  gap-[10px]  p-[10px] rounded-[4px]  shadow-md">
                <div className="flex flex-row justify-end">
                  <button
                  onClick={() => deleteFAQ(f._id, content._id)}
                  className="px-[25px] py-[4px] rounded-[4px] bg-red-400 text-white"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-col  ">
                    <h2 className="font-[600] text-dark">Question</h2>
                    <p className="text-gray-700 text-sm">{f.question}</p>
                </div>
                <div className="flex flex-col ">
                    <h2 className="font-[600] text-dark">Answer</h2>
                    <p className="text-gray-700 text-sm">{f.answer}</p>
                </div>
              </div>
            ))}
          </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
