import { DestinationWeatherData } from "@/(models)/destination";
import { IWeatherData } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try{
        const body:IWeatherData = await req.json();

        const {destinationId, date} = body;
        for(const[key, value] of Object.entries(body)) {
            if(!value) {
                return NextResponse.json({success: false, message: "kkall fileds are required"});
            }
        }
      
        await connectDB();
        //check if the date is set for that destination
        const destinationWeather = await DestinationWeatherData.find({destinationId});  
        if(destinationWeather.length > 0) {
            for(const ob of destinationWeather)  {
                if(ob.date === date) {
                    return NextResponse.json({success: false, message: "date is already set for that destination"});
                }
            }
        }
        
        const savedData = await DestinationWeatherData.create(body);
        if(savedData) {
            return NextResponse.json({success: true, message: "added successfully"});
        }else {
            return NextResponse.json({success: false, message: "something went wrong"});
        }
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    } 
}

export async function GET(req: NextRequest) {
    try{
        await connectDB();
        const destinationWeather = await DestinationWeatherData.find();
        return NextResponse.json({success: true, data: destinationWeather});
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}