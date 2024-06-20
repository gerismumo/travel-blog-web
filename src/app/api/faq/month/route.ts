
import { DestinationMonthFaq } from "@/(models)/models";
import { IDestionationMonthFaq } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body: IDestionationMonthFaq = await req.json();

        const {destinationId, month, question, answer} = body;

        console.log('fqss',body)

        if(destinationId === "" || month === "" || answer === "" || question === "") {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

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
        await connectDB();
        const destinationFaq = await DestinationMonthFaq.find();
        return NextResponse.json({success: true, data: destinationFaq});
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}