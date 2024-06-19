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
              <FontAwesomeIcon icon={fontawesome.faBolt}
              className=' text-lightRed '
              />
              <span>Weather</span>
              {openWeatherTabs ? <FontAwesomeIcon icon={fontawesome.angleUp} />: <FontAwesomeIcon icon={fontawesome.angleDown} /> }
            </button>
            {openWeatherTabs && (
              <div className="flex flex-col gap-[10px]">
                <Link href="/dashboard/weather"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className='  '
                  />
                  Add
                </Link>
                <Link href="/dashboard/weather/data"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Data
                </Link>
              </div>
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
                <Link href="/dashboard/content"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Info
                </Link>
                <Link href="/dashboard/content/month"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Month Info
                </Link>
                <Link href="/dashboard/content/data"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Info
                </Link>
                <Link href="/dashboard/content/month-data"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Month Info
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
                <Link href="/dashboard/faqs"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add FaQ
                </Link>
                <Link href="/dashboard/faqs/month"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Add Monthly FaQ
                </Link>
                <Link href="/dashboard/faqs/data"
                className='flex flex-row items-center gap-[5px] pl-[50px]  text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Data
                </Link>
                <Link href="/dashboard/faqs/month/data"
                className='flex flex-row items-center gap-[5px] pl-[50px] text-nowrap  bg-lightGrey px-[30px] py-[10px] rounded-[5px] text-grey hover:text-[#000]  text-[16px] font-[400]'
                >
                  <FontAwesomeIcon icon={fontawesome.faAngleRight}
                  className=''
                  />
                  Months Data
                </Link>
              </div>
            )}
              
        </div>
    </div>
  )
}

export default SideBar