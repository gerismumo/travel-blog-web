import { DestinationContent } from "@/(models)/destination";
import { IDestinationContent } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const body:IDestinationContent = await req.json();
        const {destinationId, weatherInfo, destinationInfo} = body;

        if(!destinationId ||!weatherInfo ||!destinationInfo) {
            return NextResponse.json({ success: false, message: 'Fill all fields' });
        }

        await connectDB();

        const existingData = await DestinationContent.findOne({destinationId});
        if(existingData) {
            return NextResponse.json({ success: false, message: 'record already exists' });
        }

        const savedData = await DestinationContent.create({destinationId, weatherInfo, destinationInfo});
        if(savedData) {
            return NextResponse.json({ success: true, message: 'Added successfully' });
        }else {
            return NextResponse.json({ success: false, message:'something went wrong' });
        }
    }catch(error) {
        return NextResponse.json({ success: false, message: 'server error' });
    }
}