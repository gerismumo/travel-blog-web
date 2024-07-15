import { DestinationFaq } from "@/(models)/models";
import { IDestionationFaq } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        cache.flushAll();
        await connectDB(); 
        const deleteData = await DestinationFaq.findByIdAndDelete(params.id);
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
    try {
        const body:IDestionationFaq = await req.json();
        const { destination, faqs } = body;

            if (destination === "" || !faqs || faqs.length === 0) {
            return NextResponse.json({ success: false, message: "All fields are required" });
            }

            for (const faq of faqs) {
            if (!faq.question.trim() || !faq.answer.trim()) {
                return NextResponse.json({ success: false, message: "All FAQ questions and answers are required" });
            }
            }

        cache.flushAll();


        await connectDB(); 
        const updateData = await DestinationFaq.findByIdAndUpdate(
            params.id,
            {
              $set: {
                destination: destination,
                faqs: faqs
              }
            },
            { new: true } 
          );
          
        if(updateData) {
            return NextResponse.json({success: true, message: "update success"})
        } else {
            return NextResponse.json({success: false, message: "update failed"})
        }
    } catch (error) {
        return NextResponse.json({success: false, message: "update failed"})
    }
}