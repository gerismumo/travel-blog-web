
import { DestinationMonthFaq } from "@/(models)/models";
import { IDestionationMonthFaq } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body: IDestionationMonthFaq = await req.json();

        const {destination, month, faqs} = body;

        if(destination === "" || month === "" || faqs.length === 0) {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

        cache.flushAll();
        await connectDB();

       

        const savedData = await DestinationMonthFaq.create(body);
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
        const cachedData = cache.get("dFaqMon");

        if(cachedData) {
            return NextResponse.json({success: true, data: cachedData})
        }
        await connectDB();
        const dFaqMon = await DestinationMonthFaq.find();
        cache.set("dFaqMon", dFaqMon)
        return NextResponse.json({success: true, data: dFaqMon});
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}