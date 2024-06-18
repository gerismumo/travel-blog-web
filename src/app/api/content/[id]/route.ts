import { DestinationContent } from "@/(models)/destination";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 
    try {
        await connectDB(); 
        const deleteData = await DestinationContent.findByIdAndDelete(id);
        if(deleteData) {
            return NextResponse.json({success: true, message: "delete success"})
        } else {
            return NextResponse.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return NextResponse.json({success: false, message: "delete failed"})
    }
}


export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 
    try{
        const body = await req.json();
        await connectDB();

        const updatedData = await DestinationContent.findByIdAndUpdate(id, {
            weatherInfo: body.weatherInfo,
            destinationInfo: body.destinationInfo
        }, {new: true});
        
        if(updatedData) {
            return NextResponse.json({success: true, message: "update success"})
        } else {
            return NextResponse.json({success: false, message: "update failed"})
        }
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}