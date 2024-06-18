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
  const [openWeatherTabs, setOpenWeatherTabs] = useState<boolean>(false);
  const [openContentTabs, setOpenContentTabs] = useState<boolean>(false);
  const [openFaqTabs, setOpenFaqTabs] = useState<boolean>(false);

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
                <Link href="/dashboard/destination/add"
                className='text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
                >Add</Link>
                <Link href="/dashboard/destination/list"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Destination List</Link>
              </div>
            )}
            <button
            onClick={() => setOpenWeatherTabs(!openWeatherTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <span>Weather</span>
              {openWeatherTabs ? <FontAwesomeIcon icon={faAngleUp} />: <FontAwesomeIcon icon={faAngleDown} /> }
            </button>
            {openWeatherTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/weather"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Add</Link>
                <Link href="/dashboard/weather/data"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Data</Link>
              </div>
            )}
            <button
            onClick={() => setOpenContentTabs(!openContentTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <span>Content</span>
              {openContentTabs ? <FontAwesomeIcon icon={faAngleUp} />: <FontAwesomeIcon icon={faAngleDown} /> }
            </button>
            {openContentTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/content"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Add Info</Link>
                <Link href="/dashboard/content/month"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Add Month Info</Link>
                <Link href="/dashboard/content/data"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Info</Link>
                <Link href="/dashboard/content/month-data"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Month Info</Link>
              </div>
            )}
            <button
            onClick={() => setOpenFaqTabs(!openFaqTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <span>Faqs</span>
              {openFaqTabs ? <FontAwesomeIcon icon={faAngleUp} />: <FontAwesomeIcon icon={faAngleDown} /> }
            </button> 
            {openFaqTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/faqs"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Add FaQ</Link>
                <Link href="/dashboard/faqs/montly"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Add Monthly FaQ</Link>
                <Link href="/dashboard/faqs/data"
                className='text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >Data</Link>
              </div>
            )}
              
        </div>
    </div>
  )
}

export default SideBar