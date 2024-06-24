import { Destination } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


async function fetchWeatherData(stationID: number) {
    const url = `https://d.meteostat.net/app/proxy/stations/daily?station=${stationID}&tz=Europe/Istanbul&start=2024-06-24&end=2024-06-26`
    const response = await axios.get(url);
    return response.data;
  }


  export  async function GET(req:NextRequest) {
    try {
      await connectDB();
      const destinations = await Destination.find({});
  
      const weatherData = await Promise.all(
        destinations.map(async (destination) => {
          const data = await fetchWeatherData(destination.stationID);
          return { 
            destinationId: destination._id, 
            stationId: destination.stationID, 
            data 
          };
        })
      );
  
      return NextResponse.json({ success: true, data: weatherData });
  
    } catch (error: any) {
        NextResponse.json({ success: false, message: 'Error fetching weather data'});
    }
  }