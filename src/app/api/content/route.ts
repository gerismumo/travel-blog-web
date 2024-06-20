import { DestinationContent } from "@/(models)/models";
import { IDestinationContent } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const body:IDestinationContent = await req.json();
        const {destinationId, weatherInfo, destinationInfo, image} = body;

        if(!destinationId ||!weatherInfo ||!destinationInfo || !image) {
            return NextResponse.json({ success: false, message: 'Fill all fields' });
        }

        await connectDB();

        const existingData = await DestinationContent.findOne({destinationId});
        if(existingData) {
            return NextResponse.json({ success: false, message: 'record already exists' });
        }

        const savedData = await DestinationContent.create({destinationId, weatherInfo, destinationInfo, image});
        if(savedData) {
            return NextResponse.json({ success: true, message: 'Added successfully' });
        }else {
            return NextResponse.json({ success: false, message:'something went wrong' });
        }
    }catch(error) {
        return NextResponse.json({ success: false, message: 'server error' });
    }
}

export async function GET(req:NextRequest) {
    try{
        await connectDB();
        const destinationContent = await DestinationContent.find();
        return NextResponse.json({ success: true, data: destinationContent });
    }catch(error) {
        return NextResponse.json({ success: false, message:'server error' });
    }
}