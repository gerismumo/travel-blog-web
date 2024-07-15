import { DestinationFaq } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    try {
        const body = await req.json();
        const contentId = body.conId;
        const faqId = params.id;
        
        if(!contentId || !faqId) {
            return NextResponse.json({success: false, message: "error deleting"})
        }

        await connectDB();

        const updateResult = await DestinationFaq.findByIdAndUpdate(
            contentId,
            { $pull: { faqs: { _id: faqId } } },
            { new: true } 
        );

        

        if (!updateResult) {
            return NextResponse.json({ success: false, message: "Content not found" });
        }

        return NextResponse.json({ success: true, message: "FAQ deleted successfully", data: updateResult });

    }catch(error) {
        return NextResponse.json({success: false, message:"server error"})
    }
}