import { DestinationFaq } from "@/(models)/models";
import { IDestionationFaq } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";


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
        const {destination, question, answer} = body;

        if(destination === "" || answer === "" || question === "") {
            return Response.json({success: false, message: "all fields are required"})
        }

        cache.flushAll();
        await connectDB(); 
        const updateData = await DestinationFaq.findByIdAndUpdate(params.id, body);
        if(updateData) {
            return Response.json({success: true, message: "update success"})
        } else {
            return Response.json({success: false, message: "update failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "update failed"})
    }
}