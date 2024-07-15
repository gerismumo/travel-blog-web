import { Destination, DestinationContent, DestinationFaq, DestinationMonthContent, DestinationMonthFaq } from "@/(models)/models";
import { IDestinationList } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect"
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";




export async function PUT(req:Request, {params}: {params: {id: string}}) {

    try {
        //check if cache exits
        cache.flushAll()
        const body:IDestinationList = await req.json();
        const {stationID, _id, name, countryCode } =body;

        if(!stationID || !_id || !name || !countryCode) {
            return Response.json({success: false, message: "all fields are required"})
        }

        if(!params.id) {
            return Response.json({success: false, message: "error occurred"})
        }
        await connectDB();
        const updatedData = await Destination.findByIdAndUpdate(params.id, {
            stationID: stationID,
            name: name,
            countryCode: countryCode
        }, {new: true});

        if(updatedData){
            return Response.json({success: true, message: "update success"})
        }else {
            return Response.json({success: false, message: "update failed"})
        }
    }catch(error) {
        return Response.json({success: false, message: "server error"})
    }
}

export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        if(!params.id) {
            return Response.json({success: false, message: "error occurred"})
        }

        await connectDB();

        const deleteD = await Destination.findByIdAndDelete(params.id);
        if(deleteD) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    }catch(error: any) {
        return Response.json({success: false, message: "server error"})
    }
}


async function fetchWeatherData(stationID: string, startDate: string, endDate: string) {
    const url = `https://d.meteostat.net/app/proxy/stations/daily?station=${stationID}&tz=Europe/Istanbul&start=${startDate}&end=${endDate}`;
    const response = await axios.get(url);
    return response.data;
}

export async function GET(req: Request, {params}: {params: {id: string}}) {
    
    const id = params.id;
  

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ success: false, message: 'Invalid destination ID' });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');;


    try {
        const cachedData = cache.get(id);

        if(cachedData) {
            return NextResponse.json({success: true, data: cachedData})
        }

        await connectDB;

        const destination = await Destination.findById(id);

        if (!destination) {
            return NextResponse.json({ success: false, message: 'Destination not found' });
        }

        const [destinationContent, destinationFaq, monthContent, monthFaq] = await Promise.all([
            DestinationContent.find({destination:id}),
            DestinationFaq.find({destination:id}),
            DestinationMonthContent.find({destination:id}),
            DestinationMonthFaq.find({destination:id})
        ]);

        let weatherData = null;

        if (startDate && endDate) {
            weatherData = await fetchWeatherData(destination.stationID, startDate as string, endDate as string);
        }

        const data ={ destinationContent, destinationFaq, monthContent, monthFaq, weatherData};
        cache.set(id, data);

        return NextResponse.json({
            success: true,
            data:data
          });

    }catch(error: any) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "server error"});
    }
}



