

import { NewsBlog } from "@/(models)/models";
import { INewsList } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        await connectDB(); 
        const deleteData = await NewsBlog.findByIdAndDelete(params.id);
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
        const body:INewsList = await req.json();
        const {heading, info, image, metaTitle, metaDescription, metaKeyWords, subNews} =body;

        if(!heading) {
            return Response.json({success: false, message: "all fields are required"})
        }
        await connectDB();

        const updatedData = await NewsBlog.findByIdAndUpdate(params.id, {
            heading: heading,
            info: info,
            image: image,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            subNews: subNews
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

