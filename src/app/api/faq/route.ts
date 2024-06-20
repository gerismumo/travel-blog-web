import { DestinationFaq } from "@/(models)/models";
import { IDestionationFaq } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body: IDestionationFaq = await req.json();

        const {destinationId, question, answer} = body;

        if(destinationId === "" || answer === "" || question === "") {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

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
        await connectDB();
        const destinationFaq = await DestinationFaq.find();
        return NextResponse.json({success: true, data: destinationFaq});
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}