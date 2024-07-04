"use client"

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import LoginForm from './components/Login';

config.autoAddCss = false;

const WeatherDashboard = () => {
  return (
   <LoginForm/>
  );
};

WeatherDashboard.displayName = "WeatherDashboard";

export default WeatherDashboard;
