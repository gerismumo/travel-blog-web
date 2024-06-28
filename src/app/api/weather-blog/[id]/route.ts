
import { DestinationWeatherBlog } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        await connectDB(); 
        const deleteData = await DestinationWeatherBlog.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "delete failed"})
    }
}


export async function PUT(req:Request, {params}: {params: {id: string}}) { 
    try{
        const body = await req.json();
        const {heading, image} = body;  

        if(!heading || !image) {
            return Response.json({success: false, message:"all fields are required"})
        }
        await connectDB();

        const updatedData = await DestinationWeatherBlog.findByIdAndUpdate(params.id, {
            heading: heading,
            image: image
        }, {new: true});
        
        if(updatedData) {
            return Response.json({success: true, message: "update success"})
        } else {
            return Response.json({success: false, message: "update failed"})
        }
    }catch(error) {
        return Response.json({success: false, message: "server error"})
    }
}

