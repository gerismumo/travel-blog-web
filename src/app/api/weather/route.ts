import { Destination, Weather } from "@/(models)/models";
import { IWeather, IWeatherData, IWeatherDataList } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

async function fetchWeatherData(stationID: string, startDate: string, endDate: string) {
    const url = `https://d.meteostat.net/app/proxy/stations/daily?station=${stationID}&tz=Europe/Istanbul&start=${startDate}&end=${endDate}`;
    const response = await axios.get(url);
    return response.data;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year');

        if(!year) {
            return NextResponse.json({success: false, message: "error occured"})
        }
        // console.log("year", year);
        
        const startDate = `${year}-01-01`
        const endDate = `${year}-12-31`

        if (!startDate || !endDate) {
            return NextResponse.json({ success: false, message: 'startDate and endDate are required' });
        }

        //
        const destinations = await Destination.find();

        let weatherData: any = [];
        await Promise.all(destinations.map(async(d) => {
            const data = await fetchWeatherData(d.stationID, startDate, endDate);

            const updatedData = {
                destination: d._id,
                stationID: d.stationID,
                data: data.data
            }

            const checkExisting: any = await Weather.findOne({ destination: d._id, stationID: d.stationID });

           

            if (checkExisting) {
                const existingDates = checkExisting.data.map((entry: any) => entry.date);

                updatedData.data.forEach((entry: any) => {
                    if (!existingDates.includes(entry.date)) {
                        weatherData.push(updatedData);
                    }
                });
            } else {
                weatherData.push(updatedData);
            }
        }))

       //insert weather data 

       if(weatherData.length > 0) {
            const result = await Weather.insertMany(weatherData);

            if(result) {
                return NextResponse.json({success: false, message: "weather updated successfully."});
            }else {
                return NextResponse.json({success: false, message: "something went wrong while updating weather data."});
            }
       }else {
            return NextResponse.json({ success: false, message: "No new weather data found for this year."});
       }
    } catch (error: any) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json({ success: false, message: 'Error fetching weather data' });
    }
}

export async function GET() {
    try{

        const cachedData = cache.get("wtd");

        if(cachedData) {
            return NextResponse.json({success: true, data: cachedData});
        }

        await connectDB();
        //select data

        const data = await Weather.find();

        cache.set("wtd", data)

        return NextResponse.json({success: true, data: data});
    }catch (error: any) {
        return NextResponse.json({success: false, message: "server error"})
    }
}

export async function PUT(req:Request) {
    try{
        const body: IWeatherDataList = await req.json();
        const {date, tavg, tmin, tmax, prcp,snow, wdir, wspd, wpgt, pres, tsun, _id} = body;

        if(!date || !tavg || !tmin || !tmax || !prcp || !snow || !wdir || !wspd || !wpgt || !pres || !tsun || !_id) {
            return NextResponse.json({success: false, message: "required fields are missing."});
        }

        await connectDB();

        const weatherDoc = await Weather.findOne({ "data._id": _id });

        if (!weatherDoc) {
            return NextResponse.json({ success: false, message: "Weather data not found." });
        }

        // console.log("weather data", weatherDoc);

        const dataObject = weatherDoc.data.find((data: any) => data._id.toString() === _id);
        // console.log("currebt edit", dataObject);
        if (!dataObject) {
            return NextResponse.json({ success: false, message: "Data object not found in weather data." });
        }

        dataObject.date = date;
        dataObject.tavg = tavg;
        dataObject.tmin = tmin;
        dataObject.tmax = tmax;
        dataObject.prcp = prcp;
        dataObject.snow = snow;
        dataObject.wdir = wdir;
        dataObject.wspd = wspd;
        dataObject.wpgt = wpgt;
        dataObject.pres = pres;
        dataObject.tsun = tsun;

        await weatherDoc.save();

        return NextResponse.json({ success: true, message: "Weather data updated successfully." });

    }catch(error: any) {
        return NextResponse.json({success: false, message: "server error"})
    }
}