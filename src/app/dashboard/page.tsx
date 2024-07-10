// pages/index.tsx

import React from 'react';

const Page: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Weather Information</h2>
            <p className="text-gray-600">View and update weather details for destinations.</p>
            <button className="mt-4 bg-lightDark hover:bg-dark text-white py-2 px-4 rounded-lg">
              View Details
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">News and Holidays</h2>
            <p className="text-gray-600">Manage news updates and holiday information.</p>
            <button className="mt-4 bg-lightDark hover:bg-dark text-white py-2 px-4 rounded-lg">
              Manage Updates
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Destination Information</h2>
            <p className="text-gray-600">Explore and update destination details.</p>
            <button className="mt-4 bg-lightDark hover:bg-dark text-white py-2 px-4 rounded-lg">
              Explore Destinations
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Weather Temperatures</h2>
            <p className="text-gray-600">Check and update weather temperatures.</p>
            <button className="mt-4 bg-lightDark hover:bg-dark text-white py-2 px-4 rounded-lg">
              Manage Temperatures
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow-md py-4 px-6 mt-auto">
        <p className="text-gray-600 text-center">&copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
