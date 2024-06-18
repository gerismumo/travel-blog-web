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
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}