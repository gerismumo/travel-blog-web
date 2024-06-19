import { DestinationMonthWeatherData } from "@/(models)/destination";
import { IWeatherMonthData } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body:IWeatherMonthData = await req.json();

        for(const[key, value] of Object.entries(body)) {
            if(!value) {
                return NextResponse.json({success: false, message: "all fields are required"})
            }
          }

        const {destinationId, year, month, day} = body

        await connectDB();
        const existingRecord = await DestinationMonthWeatherData.findOne({destinationId, year, month, day});

        if(existingRecord) {
            return NextResponse.json({success: false, message: "record already exists"})
        }

        const savedData = await DestinationMonthWeatherData.create(body);
        if(savedData) {
            return NextResponse.json({success: true, message: "added successfully"})
        }else {
            return NextResponse.json({success: false, message: "something went wrong"})
        }
    
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}

export async function GET(req:NextRequest) {
    try{
        await connectDB();
        const destinationWeather = await DestinationMonthWeatherData.find();
        return NextResponse.json({success: true, data: destinationWeather});
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}