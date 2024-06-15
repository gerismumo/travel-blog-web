'use client';

import { useState } from "react";
import Header from "../components/header";
import SideBar from "../components/SideBar";
import { Toaster } from "react-hot-toast";

export default function DashboardDetails({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar =  () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex">
            <SideBar data={{isSidebarOpen, toggleSidebar}} />
            <div className={`flex flex-col bg-darkPrimary ${isSidebarOpen ? 'lg:ml-[250px] ml-[0px] w-[100%]' :'ml-[0px] w-[100%]'} `}>
                <Header data={{isSidebarOpen, toggleSidebar}} />
                <Toaster position="top-right" reverseOrder={false} />
                <div className="mt-[100px] px-[20px] py-[10px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
