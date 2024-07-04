import { DestinationMonthContent } from "@/(models)/models";
import { IDestinationMonthContent } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body:IDestinationMonthContent = await req.json();
        const {destination, month, weatherInfo, metaTitle, metaDescription,metaKeyWords} = body;

        if(!destination ||!month ||!weatherInfo || !metaTitle || !metaDescription || !metaKeyWords) {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

        await connectDB();

        cache.flushAll();

        const existingRecord = await DestinationMonthContent.findOne({destination, month});
        
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
        const cachedData = cache.get("destinationContentMonth");

        if(cachedData) return NextResponse.json({ success: true, data: cachedData });
        
        await connectDB();
        const destinationContent = await DestinationMonthContent.find();
        cache.set("destinationContentMonth", destinationContent)
        return NextResponse.json({ success: true, data: destinationContent });
    }catch(error) {
        return NextResponse.json({ success: false, message:'server error' });
    }
}