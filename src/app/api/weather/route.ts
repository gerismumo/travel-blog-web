import { DestinationWeatherData } from "@/(models)/models";
import { IWeatherData } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try{
        const body:IWeatherData = await req.json();

        const {destinationId, month, year} = body;
        for(const[key, value] of Object.entries(body)) {
            if(!value) {
                return NextResponse.json({success: false, message: "kkall fileds are required"});
            }
        }
      
        await connectDB();
        //check if the date is set for that destination
        const destinationWeather = await DestinationWeatherData.findOne({destinationId, month, year});  
       
        if(destinationWeather) {
            return NextResponse.json({success: false, message: "year and month are already set for that destination"});
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