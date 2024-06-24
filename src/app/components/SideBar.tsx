"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';





interface SideBarProps {
  data: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
  };
}

const SideBar: React.FC<SideBarProps> = ({ data }) => {
  const { isSidebarOpen, toggleSidebar } = data;
  const [openDestinationTabs, setOpenDestinationTabs] = useState<boolean>(false);
  const [openHolidaysTabs, setOpenHolidaysTabs] = useState<boolean>(false);
  const [openContentTabs, setOpenContentTabs] = useState<boolean>(false);
  const [openFaqTabs, setOpenFaqTabs] = useState<boolean>(false);
  const [openWeatherTabs, setOpenWeatherTabs] = useState<boolean>(false)

  return (
    <div className={`fixed flex flex-col bg-slate-300 gap-[30px]   w-[250px] z-[999] px-[25px] py-[10px] overflow-auto h-[100%] ${isSidebarOpen ? '': 'hidden'}`}>
        <div className="flex flex-row justify-around">
          <img src="" alt="logo" 
          className='h-[70px] w-[70px]'
          />
          <button
          onClick={toggleSidebar}
          className='text-[30px]'
          >
            <FontAwesomeIcon icon={fontawesome.faXmark}/>
          </button>
        </div>
        <div className="flex flex-col gap-[10px]">
           <Link href="/dashboard"
            className=' flex flex-row items-cemter gap-[5px]  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faHouse} 
              className=' text-lightRed '
              />
              <span className='text-nowrap '>Home</span>
            </Link>
            <button
            onClick={() => setOpenDestinationTabs(!openDestinationTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faPlaneDeparture}
              className=' text-lightRed '
              />
              <span>Destination</span>
              {openDestinationTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openDestinationTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/destination"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className='  '
                  />
                  List
                  </Link>
                <Link href="/dashboard/destination/add"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className='  '
                  />
                  Add
                  </Link>
              </div>
            )}
            <button
            onClick={() => setOpenWeatherTabs(!openWeatherTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faPlaneDeparture}
              className=' text-lightRed '
              />
              <span>Weather</span>
              {openDestinationTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openWeatherTabs && (
              <Link href="/dashboard/weather"
              className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
              >
                <FontAwesomeIcon icon={fontawesome.faAngleRight}
                className=''
                />
                Data
              </Link>
            )}
            <button
            onClick={() => setOpenContentTabs(!openContentTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faCircleInfo}
              className=' text-lightRed '
              />
              <span>Content</span>
              {openContentTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openContentTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/add-info"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Info
                </Link>
                <Link href="/dashboard/info-data"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Data
                </Link>
                <Link href="/dashboard/add-mon-info"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Month Info
                </Link>
                
                <Link href="/dashboard/mon-info"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Month Data
                </Link>
              </div>
            )}
            <button
            onClick={() => setOpenHolidaysTabs(!openHolidaysTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faCircleInfo}
              className=' text-lightRed '
              />
              <span>Holidays</span>
              {openContentTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openHolidaysTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/add-holiday"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Holiday
                </Link>
              </div>
            )}
            <button
            onClick={() => setOpenFaqTabs(!openFaqTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-lightGrey px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faCircleQuestion}
              className=' text-lightRed '
              />
              <span>Faqs</span>
              {openFaqTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button> 
            {openFaqTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/add-faqs"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add FaQ
                </Link>
                <Link href="/dashboard/faqs"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Data
                </Link>
                <Link href="/dashboard/add-month-faqs"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Monthly FaQ
                </Link>
                <Link href="/dashboard/monthly-faqs"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Monthly Data
                </Link>
              </div>
            )}
              
        </div>
    </div>
  )
}

export default SideBar

