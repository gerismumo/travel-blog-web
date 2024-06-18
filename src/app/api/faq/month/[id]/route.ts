
import { DestinationMonthFaq } from "@/(models)/destination";
import { IDestionationMonthFaq } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 
    try {
        await connectDB(); 
        const deleteData = await DestinationMonthFaq.findByIdAndDelete(id);
        if(deleteData) {
            return NextResponse.json({success: true, message: "delete success"})
        } else {
            return NextResponse.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return NextResponse.json({success: false, message: "delete failed"})
    }
}

export async function PUT(req:NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 
    try {
        const body:IDestionationMonthFaq = await req.json();
        const {destinationId, question, month, answer} = body;

        if(destinationId === "" || month === "" || answer === "" || question === "") {
            return NextResponse.json({success: false, message: "all fields are required"})
        }

        await connectDB(); 
        const updateData = await DestinationMonthFaq.findByIdAndUpdate(id, body);
        if(updateData) {
            return NextResponse.json({success: true, message: "update success"})
        } else {
            return NextResponse.json({success: false, message: "update failed"})
        }
    } catch (error) {
        return NextResponse.json({success: false, message: "update failed"})
    }
}