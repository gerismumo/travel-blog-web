import Link from 'next/link'
import React from 'react'

interface HeaderProps {
  data: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({data}) => {
  const {isSidebarOpen, toggleSidebar} = data;
  return (
    <div className={`bg-[#ffffff] fixed z-[50] top-0  right-0 ${isSidebarOpen ? 'left-0 lg:left-[250px]': 'w-[100%] left-0'} `}>
      <nav className="flex flex-col  w-[100%] py-[10px]  px-[20px]  gap-[20px] shadow-sm">
        <div className="flex flex-row items-center justify-between ">
          <button onClick={toggleSidebar}
            className='text-white'
            >
              <img src="../images/bars.svg" alt=""
              className='h-[20px] w-[20px]'
               />
            </button>
            <div className="flex flex-row items-center gap-[30px]">
              <div className="flex flex-col items-center">
                <h2 className='font-[500]'>John Doe</h2>
                <p className='text-[14px]'>Admin</p>
              </div>
                <button
                className='font-[700]'
                >Logout</button>
            </div>
        </div>
      </nav>
    </div>
  )
}

export default Header