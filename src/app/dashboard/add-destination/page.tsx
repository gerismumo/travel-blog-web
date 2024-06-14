"use client"

import React, { useState } from 'react'

const AddDestination = () => {
  const[openAddRegion, setOpenAddRegion] = useState<Boolean>(false);
  const[regions, setRegions] = useState<string[]>([]);
  const[destination, setDestination] = useState<string>('');
  const[newRegion, setNewRegion] = useState<string>('');


  const handleOpenAddRegion = (e: any) => {
    e.preventDefault();
    setOpenAddRegion(!openAddRegion);
  }

  const handleNewRegion = (e: any) => {
    e.preventDefault();

    if(newRegion === '' || destination === '') {
      alert("fill all the required fields");
      return;
    }

    setRegions([...regions, newRegion]);
    setNewRegion('');
  }


  const handleSubmit = (e: any) => {
    e.preventDefault();


    if(destination === '') {
      alert("fill all the required fields");
      return;
    }

    console.log(destination);
    console.log(regions)

  }


  return (
    <div className="flex flex-col">
      <form 
      onSubmit={(e) => handleSubmit(e)}
      className='flex flex-col gap-[10px]'
      >
        <div className="flex flex-col">
          <label htmlFor="destination">Destination</label>
          <input type="text"
          placeholder='e.g Kenya'
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className='input'
           />
        </div>
        <div className="flex flex-col">
          <button
          onClick={(e) => handleOpenAddRegion(e)}
          className='bg-darkBlue px-[15px] py-[3px] text-[15px] rounded-[3px] text-white'
          >
            {openAddRegion ? "close": "Add destination regions?"}
          </button>
        </div>
        {openAddRegion && (
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-col">
              <label htmlFor="destination">Region</label>
              <input type="text"
              placeholder='e.g Mombasa'
              className='input'
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              />
            </div>
            <button
            onClick={(e) => handleNewRegion(e)}
            className='bg-darkBlue px-[15px] w-[100%] py-[3px] text-[15px] rounded-[3px] text-white'
            >Add Region</button>
            {regions.length > 0 && (
              <div className="flex flex-col gap-[5px] mt-4">
                {regions.map((region, index) => (
                  <div key={index} className='flex justify-between items-center border-b-[1px] border-[#ddd] pb-[5px] '>
                    <span className='text-black'>{region}</span>
                    <button
                      onClick={() => setRegions(regions.filter((_, i) => i !== index))}
                      className='text-red-500 hover:text-red-700'
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button
        type='submit'
        className='bg-lightRed px-[30px] py-[6px] rounded-[6px] w-[100%] text-white'
        >Submit</button>
      </form>
    </div>
  )
}

export default AddDestination