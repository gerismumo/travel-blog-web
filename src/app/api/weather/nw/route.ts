import { Destination, Weather } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {destination, data} = body;
        
        if(!destination ||!data) {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

        for(const entry of data) {
            for(const key in entry) {
                if(!entry[key]) {
                    return NextResponse.json({success: false, message: "all fields are required in the weather data"})
                }
            }
        }

        //check if the data exists in the db
        cache.flushAll();
        await connectDB();

        const destinationDetail = await Destination.findOne({_id:destination})
        
        if(!destinationDetail) {
            return NextResponse.json({success: false, message: "destination not found"})
        }

        const insertD = {
            destination: destination,
            stationID: destinationDetail.stationID,
            data: data
        }
        
        const existingData: any = await Weather.findOne({destination:destination});

        if(existingData) {
            const existingDates = existingData.data.map((entry: any) => entry.date);

            const uniqueData = data.filter((w: any) => !existingDates.includes(w.date));
           
            if (uniqueData.length > 0) {
                existingData.data.push(...uniqueData);
                await existingData.save();
            }

            return NextResponse.json({ success: true, message: "Weather data updated successfully." });
        }else {
            const newWeather = new Weather(insertD);
            await newWeather.save();
            return NextResponse.json({ success: true, message: "Weather data inserted successfully." });
        }

        


    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
} 