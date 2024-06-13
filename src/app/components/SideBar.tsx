import Link from 'next/link'
import React from 'react'

interface SideBarProps {
  data: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
  };
}

const SideBar: React.FC<SideBarProps> = ({ data }) => {
  const { isSidebarOpen, toggleSidebar } = data;

  return (
    <div className={`fixed flex flex-col gap-[30px] bg-[#FCFAF1] w-[250px] z-[999] px-[25px] py-[10px] overflow-auto h-[100%] ${isSidebarOpen ? '': 'hidden'}`}>
        <div className="flex flex-row justify-around">
          <img src="" alt="logo" 
          className='h-[70px] w-[70px]'
          />
          <button
          onClick={toggleSidebar}
          >
            <img src="../images/cross.svg" alt=""
            className='h-[20px] w-[20px]'
             />
          </button>
        </div>
        <div className="flex flex-col gap-[10px]">
            <Link href="/dashboard/add-destination"
            className='text-nowrap  bg-[#EEEEEE] px-[30px] py-[8px] rounded-[6px] text-[#000] text-[16px] font-[600]'
            >Add Destination</Link>
            <Link href=""
            className='text-nowrap  bg-[#EEEEEE] px-[30px] py-[8px] rounded-[6px] text-[#000] font-[600]'
            >Add Region</Link>
            <Link href=""
            className='text-nowrap  bg-[#EEEEEE] px-[30px] py-[8px] rounded-[6px] text-[#000] font-[600]'
            >Current Weather</Link>
        </div>
    </div>
  )
}

export default SideBar