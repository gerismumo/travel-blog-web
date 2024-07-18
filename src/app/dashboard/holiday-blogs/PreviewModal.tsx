"use client"
import React, { useEffect, useState } from "react";
import { IDestinationList, IHolidayBlogList } from "@/(types)/type";
import { months } from "@/lib/months";
import { getDestinations } from "@/utils/(apis)/destinationApi";
import toast from "react-hot-toast";

interface PreviewModalProps {
  show: boolean;
  data: IHolidayBlogList;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ show, data, onClose }) => {
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
          <div className="mt-4 flex flex-col gap-[15px]">
            {data?.coverImage && (
              <div className="flex flex-col justify-center ">
                <h2 className="font-[600] text-dark">Cover Image</h2>
                <img src={data?.coverImage as string} alt="" className="w-full h-auto max-h-96 object-cover" />
              </div>
            )}
            {data?.category && (
              <div className="flex flex-col  ">
                <h2 className="font-[600] text-dark">Category</h2>
                <p className="text-gray-700 text-sm ">{data?.category}</p>
            </div>
            )}
            {data?.destination && (
              <div className="flex flex-col">
                <h2 className="font-[600] text-dark">Destination</h2>
                <p className="text-gray-700 text-sm ">{destinations.find(d => d._id === data?.destination)?.name}</p>
            </div>
            )}
            {data?.overViewHeading && (
              <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Over View Heading</h2>
                <p className="text-gray-700 text-sm ">{data?.overViewHeading}</p>
            </div>
            )}
            {data?.image && (
              <div className="flex flex-col justify-center ">
                <h2 className="font-[600] text-dark">Image</h2>
                <img src={data?.image as string} alt="" className="w-full h-auto max-h-96 object-cover" />
              </div>
            )}
            {data?.heading && (
              <div className="flex flex-col gap-[5px]">
                <h2 className="font-[600] text-dark">Heading</h2>
                <p className="text-gray-700 text-sm ">{data?.heading}</p>
            </div>
            )}
            {data?.overViewDescription && (
              <div className="flex flex-col gap-[5px]">
                <h2 className="font-[600] text-dark">Over View Description</h2>
                <p className="text-gray-700 text-sm ">{data?.overViewDescription}</p>
            </div>
            )}
            {data?.metaTitle && (
              <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Title</h2>
                <p className="text-gray-700 text-sm ">{data?.metaTitle}</p>
            </div>
            )}
            {data?.metaDescription && (
              <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Decription</h2>
                <p className="text-gray-700 text-sm ">{data?.metaDescription}</p>
            </div>
            )}
            {data?.metaKeyWords && (
              <div className="flex flex-col ">
                  <h2 className="font-[600] text-dark">Meta Keyword</h2>
                  <p className="text-gray-700 text-sm">{data?.metaKeyWords}</p>
              </div>
            )}
            {data?.otherCategory && (
              <div className="flex flex-col gap-[5px]">
                  <h2 className="font-[600] text-dark">Sub Category</h2>
                  <p className="text-gray-700 text-sm">{data?.otherCategory}</p>
              </div>
            )}
            {data.WeatherHolidayContent.length > 0 && (
              <div className="flex flex-col">
                {data?.month !== null && (
                    <div className="flex flex-row items-center gap-[5px] mb-4">
                        <h2 className="font-[600] text-dark">Month:</h2>
                        <p className="text-gray-700 text-sm ">{data?.month !== null && months.find(m => m.id === parseInt(data?.month as string))?.name}</p>
                    </div>
                )}
                <div className="flex flex-col gap-[10px]">
                  <h2 className="font-[600] text-dark">Contents</h2>
                  {data.WeatherHolidayContent.map((w, index) => (
                    <div key={index}>
                      <div className="flex flex-col gap-[10px] border-[1px] border-[#ddd] p-[10px]">
                          <h2 className="font-[600] text-dark  ">{destinations.find(d => d._id === w.destination)?.name}</h2>
                          <p className="text-gray-700 text-sm  ">{w.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.OtherHolidayContent.length > 0 && (
              <div className="flex flex-col">
                {data.OtherHolidayContent.map((h, index) => (
                  <div key={index} className="flex flex-col gap-[10px]">
                    {h.destination && (
                      <div className="flex flex-col">
                        <h2 className="font-[600] text-dark">Destination</h2>
                        <p className="text-gray-700 text-sm ">{destinations.find(d => d._id === h?.destination)?.name}</p>
                    </div>
                    )}
                    {h.subHeading && (
                      <div className="flex flex-col">
                        <h2 className="font-[600] text-dark">Heading</h2>
                        <p className="text-gray-700 text-sm ">{h.subHeading}</p>
                    </div>
                    )}
                    {h.subImage && (
                      <div className="flex flex-col justify-center">
                        <h2 className="font-[600] text-dark">Image</h2>
                        <img src={h.subImage as string} alt="" className="w-full h-auto max-h-96 object-cover" />
                      </div>
                    )}
                    {h.subDescription && (
                      <div className="flex flex-col">
                        <h2 className="font-[600] text-dark">Description</h2>
                        <p className="text-gray-700 text-sm ">{h.subDescription}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
