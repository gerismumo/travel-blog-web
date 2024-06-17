import { DestinationWeatherData } from "@/(models)/destination";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    //get id
    const id = url.pathname.split('/').pop();  
    try {
        await connectDB(); 
        const deleteData = await DestinationWeatherData.findByIdAndDelete(id);
        if(deleteData) {
            return NextResponse.json({ success: true, message: 'Deleted successfully' });
        }else {
            return NextResponse.json({ success: false, message: 'Something went wrong' });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'server error' }); 
    }
}

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    //get id
    const id = url.pathname.split('/').pop();  
    try {
        const body = await req.json();
        for(const[key, value] of Object.entries(body)) {
            if(!value) {
               return NextResponse.json({ success:false, message:"all fields are required"});
            }
          }

        await connectDB(); 
        const updateData = await DestinationWeatherData.findByIdAndUpdate(id, body, { new: true });
        if(updateData) {
            return NextResponse.json({ success: true, message: 'Updated successfully' });
        }else {
            return NextResponse.json({ success: false, message: 'Something went wrong' });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message:'server error' }); 
    }
}