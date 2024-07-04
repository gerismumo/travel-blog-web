import { Destination } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

async function fetchWeatherData(stationID: string, startDate: string, endDate: string) {
    const url = `https://d.meteostat.net/app/proxy/stations/daily?station=${stationID}&tz=Europe/Istanbul&start=${startDate}&end=${endDate}`;
    const response = await axios.get(url);
    return response.data;
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const destinationId = searchParams.get('destinationId');

        if (!startDate || !endDate) {
            return NextResponse.json({ success: false, message: 'startDate and endDate are required' });
        }

        let destinations;
        if (destinationId) {
            destinations = await Destination.find({ _id: destinationId });
        } else {
            destinations = await Destination.find({});
        }

        const weatherData = await Promise.all(
            destinations.map(async (destination) => {
                const data = await fetchWeatherData(destination.stationID, startDate, endDate);
                return { 
                    destination: destination._id, 
                    stationId: destination.stationID, 
                    data 
                };
            })
        );
        // cache.set("")
        return NextResponse.json({ success: true, data: weatherData });

    } catch (error: any) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json({ success: false, message: 'Error fetching weather data' });
    }
}
