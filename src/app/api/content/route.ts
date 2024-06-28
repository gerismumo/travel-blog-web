import { DestinationContent } from "@/(models)/models";
import { IDestinationContent } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const body:IDestinationContent = await req.json();
        const {destination, weatherInfo, destinationInfo, image, metaTitle, metaDescription,metaKeyWords} = body;

        if(!destination ||!weatherInfo ||!destinationInfo || !image || !metaTitle || !metaDescription || !metaKeyWords) {
            return NextResponse.json({ success: false, message: 'Fill all fields' });
        }

        await connectDB();

        const existingData = await DestinationContent.findOne({destination});
        if(existingData) {
            return NextResponse.json({ success: false, message: 'record already exists' });
        }

        const savedData = await DestinationContent.create({destination, weatherInfo, destinationInfo, image, metaTitle, metaDescription,metaKeyWords});
        if(savedData) {
            return NextResponse.json({ success: true, message: 'Added successfully' });
        }else {
            return NextResponse.json({ success: false, message:'something went wrong' });
        }
    }catch(error) {
        console.log(error);
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