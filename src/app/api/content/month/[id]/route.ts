
import { DestinationMonthContent } from "@/(models)/destination";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 
    try {
        await connectDB(); 
        const deleteData = await DestinationMonthContent.findByIdAndDelete(id);
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

        const {destinationId, month, weatherInfo, destinationInfo} = body;

        if(destinationId === "" || month === "" || weatherInfo === "" || destinationInfo === "") {
            return NextResponse.json({success: false, message: "all fields are required"})
        }
        
        await connectDB();

        let updateData;
        const existingRecord = await DestinationMonthContent.findOne({ destinationId, month });
        if(existingRecord) {
            updateData = await DestinationMonthContent.findByIdAndUpdate(id, 
                {
                    weatherInfo: body.weatherInfo,
                    destinationInfo: body.destinationInfo,
                },
                {new: true}
            )
            return NextResponse.json({ success: true, message: 'Record with same date updated' });

        }else {
            updateData = await DestinationMonthContent.findByIdAndUpdate(id, {
                destinationId, month, weatherInfo, destinationInfo
            }, {new: true});
        }

        if (updateData) {
            return NextResponse.json({ success: true, message: 'Updated successfully' });
          } else {
            return NextResponse.json({ success: false, message: 'Something went wrong' });
          } 
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}