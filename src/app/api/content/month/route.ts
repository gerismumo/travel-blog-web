import { DestinationMonthContent } from "@/(models)/models";
import { IDestinationMonthContent } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body:IDestinationMonthContent = await req.json();
        const {destinationId, month, weatherInfo} = body;

        if(!destinationId ||!month ||!weatherInfo) {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

        await connectDB();

        const existingRecord = await DestinationMonthContent.findOne({destinationId, month});
        
        if(existingRecord) {
            return NextResponse.json({success: false, message: "record already exists"});
        }

        const savedData = await DestinationMonthContent.create(body);
        if(savedData) {
            return NextResponse.json({success: true, message: "added successfully"});
        }else {
            return NextResponse.json({success: false, message: "something went wrong"});
        }
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}

export async function GET(req:NextRequest) {
    try{
        await connectDB();
        const destinationContent = await DestinationMonthContent.find();
        return NextResponse.json({ success: true, data: destinationContent });
    }catch(error) {
        return NextResponse.json({ success: false, message:'server error' });
    }
}