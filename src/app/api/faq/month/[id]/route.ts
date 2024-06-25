
import { DestinationMonthFaq } from "@/(models)/models";
import { IDestionationMonthFaq } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        await connectDB(); 
        const deleteData = await DestinationMonthFaq.findByIdAndDelete(params.id);
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
        const body:IDestionationMonthFaq = await req.json();
        const {destination, question, month, answer} = body;

        if(destination === "" || month === "" || answer === "" || question === "") {
            return Response.json({success: false, message: "all fields are required"})
        }

        await connectDB(); 
        const updateData = await DestinationMonthFaq.findByIdAndUpdate(params.id, body);
        if(updateData) {
            return Response.json({success: true, message: "update success"})
        } else {
            return Response.json({success: false, message: "update failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "update failed"})
    }
}