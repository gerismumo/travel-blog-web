"use client"

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Toaster } from "react-hot-toast";
import axios from 'axios';
import { useEffect } from 'react';
import LoginForm from './components/Login';




config.autoAddCss = false;

const WeatherDashboard = () => {

//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const response = await axios.post('/api');
//             console.log(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     fetchData();
// }, []); 
  


  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
      <LoginForm/>
    </>
   
  );
};

WeatherDashboard.displayName = "WeatherDashboard";

export default WeatherDashboard;
