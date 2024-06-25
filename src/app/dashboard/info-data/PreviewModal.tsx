
import { IDestinationContentList } from '@/(types)/type';
import React from 'react';

interface PreviewModalProps {
  show: boolean;
  onClose: () => void;
  content: IDestinationContentList | null;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ show, onClose, content }) => {
  if (!show || !content) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-8 rounded shadow-lg z-10 max-w-3xl mx-auto">
        <h2 className="text-2xl mb-4">Preview</h2>
        <p><strong>Destination:</strong> {content.destinationInfo}</p>
        <p><strong>Weather Info:</strong> {content.weatherInfo}</p>
        <div className="mt-4">
          <img src={content.image} alt="Preview" className="w-full h-auto" />
        </div>
        <button onClick={onClose} className="mt-4 bg-lightDark text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;
