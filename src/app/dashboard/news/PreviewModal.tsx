"use client"
import React, { useEffect, useState } from "react";
import {  IDestinationList, IDestinationMonthContentList, INewsList, ISubNews } from "@/(types)/type";
import { getDestinations } from "@/utils/(apis)/destinationApi";
import toast from "react-hot-toast";

interface PreviewModalProps {
  show: boolean;
  content: INewsList;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ show, content, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto ">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity " onClick={onClose}></div>
      <div className="bg-white max-w-full w-[800px] sm:mx-5   rounded-[3px] shadow-xl overflow-auto z-[20] h-[85vh]">
        <div className="flex justify-between items-center px-6 py-4 bg-lightDark text-white">
          <h2 className="text-lg font-semibold">News</h2>
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
            <div className="flex justify-center">
                <img src={content?.image as string} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Heading</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.heading}</p>
            </div>
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Info</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.info}</p>
            </div>
            {content?.metaTitle && (
              <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Title</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.metaTitle}</p>
            </div>
            )}
            {content?.metaDescription && (
              <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Description</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.metaDescription}</p>
            </div>
            )}
            {content?.metaKeyWords && (
              <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Meta Keywords</h2>
                <p className="text-gray-700 text-sm mb-4">{content?.metaKeyWords}</p>
            </div>
            )}
            <div className="flex flex-col ">
                <h2 className="font-[600] text-dark">Sub News</h2>
            </div>
            {content.subNews.map((s, index) => (
              <div key={index} className="">
                <div className="flex flex-col ">
                  <h2 className="font-[600] text-dark">Heading</h2>
                  <p className="text-gray-700 text-sm mb-4">{s.subHeading}</p>
                </div>
                <div className="flex flex-col ">
                  <h2 className="font-[600] text-dark">Image</h2>
                  <img src={s.subImage as string} alt="" className="w-full h-auto max-h-96 object-cover" />
                </div>
                <div className="flex flex-col ">
                  <h2 className="font-[600] text-dark">Info</h2>
                  <p className="text-gray-700 text-sm mb-4">{s.subText}</p>
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
