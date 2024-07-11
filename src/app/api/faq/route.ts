import { DestinationFaq } from "@/(models)/models";
import { IDestionationFaq } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body: IDestionationFaq = await req.json();

        const {destination, faqs} = body;

        if(destination === "" || faqs.length === 0) {
            return NextResponse.json({success: false, message: "all fields are required"})
        }
        
        cache.flushAll();
        await connectDB();

        

        const savedData = await DestinationFaq.create(body);
        if(savedData) {
            return NextResponse.json({success: true, message: "added successfully"})
        }else {
            return NextResponse.json({success: false, message: "something went wrong"})
        }
    }catch (error) {
       return NextResponse.json({success: false, message: "server error"})
    }
}

export async function GET(req: NextRequest) {
    try{
        const cachedData = cache.get("destinationFaq");
        if(cachedData) {
            return NextResponse.json({success: true, data: cachedData});
        }

        await connectDB();
        const destinationFaq = await DestinationFaq.find();
        cache.set("destinationFaq", destinationFaq);
        return NextResponse.json({success: true, data: destinationFaq});
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}