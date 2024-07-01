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
  const [openWeatherTabs, setOpenWeatherTabs] = useState<boolean>(false);
  const [openThingsTodo, setOpenThingsTodo] = useState<boolean>(false);

  return (
    <div className={`fixed flex flex-col bg-slate-100 gap-[30px]   w-[250px] z-[999] px-[25px] py-[10px] overflow-auto h-[100%] ${isSidebarOpen ? '': 'hidden'}`}>
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
            className=' flex flex-row items-center  gap-[5px]  bg-white px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faHouse} 
              className=' text-grey '
              />
              <span className='text-nowrap '>Home</span>
            </Link>
            <button
            onClick={() => setOpenDestinationTabs(!openDestinationTabs)}
            className=' flex flex-row gap-[10px] items-center justify-between text-nowrap  bg-white px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <div className="flex flex-row items-center gap-[5px]">
                <FontAwesomeIcon icon={fontawesome.faPlaneDeparture}
                className=' text-grey '
                />
                <span>Destination</span>
              </div>
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
            className=' flex flex-row gap-[10px] items-center justify-between text-nowrap  bg-white px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <div className="flex flex-row items-center gap-[5px]">
                <FontAwesomeIcon icon={fontawesome.faBolt}
                className='text-grey '
                />
                <span>Weather</span>
              </div>
              {openDestinationTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openWeatherTabs && (
              <div className='flex flex-col gap-[10px]'>
                <Link href="/dashboard/weather"
                  className='flex flex-row items-center gap-[5px] text-nowrap  px-[30px] py-[3px]  text-grey hover:text-[#000]  text-[16px] font-[400] border-b-[1px] border-b-slate-300'
                  >
                    {/* <FontAwesomeIcon icon={fontawesome.faAngleRight}
                    className=''
                    /> */}
                    Data
                </Link>
                <div className="flex flex-col gap-[10px]">
                  <button
                    onClick={() => setOpenContentTabs(!openContentTabs)}
                    className=' flex flex-row gap-[10px] items-center text-nowrap  px-[30px]  py-[3px]  text-grey hover:text-[#000] text-[16px] font-[400] border-b-[1px] border-b-slate-300'
                    >
                      <span>Content</span>
                      {openContentTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
                  </button>
                  {openContentTabs && (
                    <div className="flex flex-col gap-[10px]">
                      <Link href="/dashboard/info-data"
                      className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                      >
                        <FontAwesomeIcon icon={fontawesome.faAngleRight}
                        className=''
                        />
                        Data
                      </Link>
                      <Link href="/dashboard/month-info"
                      className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                      >
                        <FontAwesomeIcon icon={fontawesome.faAngleRight}
                        className=''
                        />
                        Month Data
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-[10px]">
                  <button
                  onClick={() => setOpenFaqTabs(!openFaqTabs)}
                  className=' flex flex-row gap-[10px] items-center text-nowrap px-[30px]  py-[3px]  text-grey hover:text-[#000] text-[16px] font-[400] border-b-[1px] border-b-slate-300'
                  >
                    {/* <FontAwesomeIcon icon={fontawesome.faCircleQuestion}
                    className=' text-lightRed '
                    /> */}
                    <span>Faqs</span>
                    {openFaqTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
                  </button> 
                  {openFaqTabs && (
                    <div className="flex flex-col gap-[10px]">
                      <Link href="/dashboard/faqs"
                      className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                      >
                        <FontAwesomeIcon icon={fontawesome.faAngleRight}
                        className=''
                        />
                        Data
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
            )}
            <button
            onClick={() => setOpenHolidaysTabs(!openHolidaysTabs)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-white px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              <FontAwesomeIcon icon={fontawesome.faCircleInfo}
              className=' text-grey '
              />
              <span>Holidays</span>
              {openContentTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openHolidaysTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/holiday-blogs"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  px-[30px] py-[3px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400] '
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Blogs
                </Link>
              </div>
            )}
            <button
            onClick={() => setOpenThingsTodo(!openThingsTodo)}
            className=' flex flex-row gap-[10px] items-center text-nowrap  bg-white px-[30px]  py-[10px] rounded-[5px] text-grey hover:text-[#000] text-[16px] font-[400]'
            >
              {/* <FontAwesomeIcon icon={fontawesome.faCircleInfo}
              className=' text-grey '
              /> */}
              <span>Things to do</span>
              {openThingsTodo ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openThingsTodo && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/things-to-do"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  px-[30px] py-[3px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400] '
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Data
                </Link>
              </div>
            )}
        </div>
    </div>
  )
}

export default SideBar

