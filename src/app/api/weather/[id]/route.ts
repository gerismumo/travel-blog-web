import { Weather } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: Request, {params}:{params: { id: string}}) {
    try {
        await connectDB();

        
        const dataId = params.id;

        if (!dataId) {
            return NextResponse.json({ success: false, message: 'dataId is required' });
        }

        
        const weatherDoc = await Weather.findOne({ "data._id": dataId });

        if (!weatherDoc) {
            return NextResponse.json({ success: false, message: 'Data not found' });
        }

        weatherDoc.data = weatherDoc.data.filter((entry: any) => entry._id.toString() !== dataId);

        
        await weatherDoc.save();

        return NextResponse.json({ success: true, message: 'Data object deleted successfully' });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Server error' });
    }
}