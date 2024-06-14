import Link from 'next/link'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';

interface SideBarProps {
  data: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
  };
}

const SideBar: React.FC<SideBarProps> = ({ data }) => {
  const { isSidebarOpen, toggleSidebar } = data;
  const [openDestinationTabs, setOpenDestinationTabs] = useState<boolean>(false);

  return (
    <div className={`fixed flex flex-col bg-slate-300 gap-[30px]   w-[250px] z-[999] px-[25px] py-[10px] overflow-auto h-[100%] ${isSidebarOpen ? '': 'hidden'}`}>
        <div className="flex flex-row justify-around">
          <img src="" alt="logo" 
          className='h-[70px] w-[70px]'
          />
          <button
          onClick={toggleSidebar}
          >
            <img src="../images/cross.svg" alt=""
            className='h-[25px] w-[25px]'
             />
          </button>
        </div>
        <div className="flex flex-col gap-[10px]">
           <Link href="/dashboard"
            className=' flex flex-row items-cemter gap-[5px]  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={faHome} 
              className='text-[24px] text-lightRed '
              />
              <span className='text-nowrap '>Home</span>
            </Link>
            <button
            onClick={() => setOpenDestinationTabs(!openDestinationTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <span>Destination</span>
              {openDestinationTabs ? <FontAwesomeIcon icon={faAngleUp} />: <FontAwesomeIcon icon={faAngleDown} /> }
            </button>
            {openDestinationTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/add-destination"
                className='text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
                >Add</Link>
                <Link href="/dashboard/destination-weather"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Add Weather</Link>
              </div>
            )}
            <Link href=""
            className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
            >Current Weather</Link>
        </div>
    </div>
  )
}

export default SideBar