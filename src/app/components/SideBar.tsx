"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import { useRouter } from 'next/router';





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
  const [openNews, setOpenNews] = useState<boolean>(false);

  

  return (
    <div className={`fixed flex flex-col bg-dark gap-[30px]   w-[250px] z-[999] px-[20px] py-[10px] overflow-auto h-[100%] ${isSidebarOpen ? '': 'hidden'}`}>
        <div className="flex flex-row justify-around">
          <img src="" alt="logo" 
          className='h-[70px] w-[70px]'
          />
          <button
          onClick={toggleSidebar}
          className='text-[30px] text-white'
          >
            <FontAwesomeIcon icon={fontawesome.faXmark}/>
          </button>
        </div>
        <div className="flex flex-col gap-[10px]">
           <Link href="/dashboard"
            className='sidebar-link'
            >
              <div className="flex flex-row items-center gap-[20px]">
                <FontAwesomeIcon icon={fontawesome.faHouse} 
                />
                <span className='text-nowrap '>Home</span>
              </div>
              <span></span>
            </Link>
            <button
            onClick={() => setOpenDestinationTabs(!openDestinationTabs)}
            className='sidebar-link '
            >
              <div className="flex flex-row items-center gap-[20px]">
                <FontAwesomeIcon icon={fontawesome.faPlaneDeparture}
                  className=''
                />
                <span>Destination</span>
              </div>
              {openDestinationTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openDestinationTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/destination"
                className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className='  '
                  />
                  List
                  </Link>
                <Link href="/dashboard/destination/add"
                className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
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
            className='sidebar-link'
            >
              <div className="flex flex-row items-center gap-[20px]">
                <FontAwesomeIcon icon={fontawesome.faBolt}/>
                <span>Weather</span>
              </div>
              {openDestinationTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openWeatherTabs && (
              <div className='flex flex-col gap-[10px]'>
                <Link href="/dashboard/weather"
                  className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
                  >
                    <FontAwesomeIcon icon={fontawesome.faAngleRight}
                    className=''
                    />
                    Data
                </Link>
                <div className="flex flex-col gap-[10px]">
                  <button
                    onClick={() => setOpenContentTabs(!openContentTabs)}
                    className='flex flex-row items-center justify-between pl-[50px]   hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
                    >
                      <span>Content</span>
                      {openContentTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
                  </button>
                  {openContentTabs && (
                    <div className="flex flex-col gap-[10px]">
                      <Link href="/dashboard/info-data"
                      className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
                      >
                        <FontAwesomeIcon icon={fontawesome.faAngleRight}
                        className=''
                        />
                        Data
                      </Link>
                      <Link href="/dashboard/month-info"
                      className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
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
                  className=' flex flex-row items-center justify-between pl-[50px]   hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
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
                      className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
                      >
                        <FontAwesomeIcon icon={fontawesome.faAngleRight}
                        className=''
                        />
                        Data
                      </Link>
                      <Link href="/dashboard/monthly-faqs"
                      className='flex flex-row items-center justify-start pl-[50px] gap-[20px]  hover:bg-white px-[20px]  py-[12px] rounded-[8px] text-white hover:text-dark text-[16px] font-[400]'
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
            <Link
            href="/dashboard/holiday-blogs"
            className='sidebar-link'
            >
              <div className="flex flex-row items-center gap-[20px]">
                <FontAwesomeIcon icon={fontawesome.faHollyBerry}/>
                <span>Holidays</span>
              </div>
            </Link>
            <Link
            href="/dashboard/things-to-do"
            className='sidebar-link'
            >
              <div className="flex flex-row items-center gap-[20px]">
                <FontAwesomeIcon icon={fontawesome.faArrowsToDot}
                  className=''
                  />
                <span>Things to do</span>
              </div>
            </Link>
            <Link
            href='/dashboard/news'
            className='sidebar-link'
            >
              <div className="flex flex-row items-center gap-[20px]">
                <FontAwesomeIcon icon={fontawesome.faNewspaper}
                  className=''
                  />
                <span>news</span>
              </div>
            </Link>
            
        </div>
    </div>
  )
}

export default SideBar

