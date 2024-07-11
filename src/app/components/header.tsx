

import fontawesome from '@/(icons)/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

interface HeaderProps {
  data: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
  };
  user: {
    id: string,
    email: string
} | null;
}

const Header: React.FC<HeaderProps> = ({data, user}) => {
  const {isSidebarOpen, toggleSidebar} = data;
  const router = useRouter();

  const handleLogout = async() => {
    try{
      const response = await axios.post('/api/auth/logout');
      if(response.data.success) {
        toast.success(response.data.message);
        router.push('/');
      }else {
        toast.error(response.data.message);
      }
    }catch(error: any) {
      toast.error("network error");
    }
  }
  
  return (
    <div className={`bg-lightRed fixed z-[50] top-0  right-0 ${isSidebarOpen ? 'left-0 lg:left-[250px]': 'w-[100%] left-0'} `}>
      <nav className="flex flex-col  w-[100%] py-[15px]  px-[20px]  gap-[20px] shadow-sm">
        <div className="flex flex-row items-center justify-between ">
          <button onClick={toggleSidebar}
            className='text-white text-[22px]'
            >
              <FontAwesomeIcon icon={fontawesome.faBars}/>
            </button>
            <div className="flex flex-row items-center gap-[30px]">
              <div className="flex flex-col items-center">
                <h2 className='font-[500] text-[15px]'>{user? user.email : "Guest"}</h2>
                <p className='text-[13px]'>Admin</p>
              </div>
                <button
                onClick={handleLogout}
                className='bg-darkBlue px-[25px] py-[8px] rounded-[6px] text-white '
                >Logout</button>
            </div>
        </div>
      </nav>
    </div>
  )
}

export default Header