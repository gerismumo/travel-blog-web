import { DestinationMonthWeatherData } from "@/(models)/destination";
import { IWeatherMonthDataList } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    //get id
    const id = url.pathname.split('/').pop();  
    try {
        await connectDB(); 
        const deleteData = await DestinationMonthWeatherData.findByIdAndDelete(id);
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
    const id = url.pathname.split('/').pop(); 

    try {
        const body: IWeatherMonthDataList = await req.json();

        for(const[key, value] of Object.entries(body)) {
            if(!value) {
                return NextResponse.json({success: false, message: "all fields are required"})
            }
          }

        const {destinationId, year, month, day, ...updateFields} = body
        await connectDB();

        const existingRecord = await DestinationMonthWeatherData.findOne({destinationId:destinationId, year:year, month:month, day:day});
        let updateData;

        if(existingRecord) {
            updateData = await DestinationMonthWeatherData.findByIdAndUpdate(id, 
                {
                    airTemperature: body.airTemperature,
                    waterTemperature: body.waterTemperature,
                    humidity: body.humidity,
                    condition: body.condition,
                    sunnyHours: body.sunnyHours,
                },
                {new: true}
            )
            return NextResponse.json({ success: true, message: 'Record with same date updated' });
        }else {
            updateData = await DestinationMonthWeatherData.findByIdAndUpdate(id, { destinationId, year, month, day, ...updateFields }, { new: true });
        }

        if (updateData) {
            return NextResponse.json({ success: true, message: 'Updated successfully' });
          } else {
            return NextResponse.json({ success: false, message: 'Something went wrong' });
          }

    }catch(error) {
        return NextResponse.json({success: false, message: "update failed"})
    }
}