import { Destination, DestinationContent, DestinationFaq, DestinationMonthContent, DestinationMonthFaq } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import axios from "axios";
import { NextResponse } from "next/server";

async function fetchWeatherData(stationID: string, startDate: string, endDate: string) {
    const url = `https://d.meteostat.net/app/proxy/stations/daily?station=${stationID}&tz=Europe/Istanbul&start=${startDate}&end=${endDate}`;
    const response = await axios.get(url);
    return response.data;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {

        const cachedData = cache.get("d-al");

        if(cachedData) {
            return NextResponse.json({success: true, data: cachedData})
        }
        await connectDB;

        const destination = await Destination.find();

        // console.log(destination);
        let data: any =[]
        await Promise.all(destination.map(async(d) => {
            const content = await DestinationContent.findOne({destination: d._id})
            const faq = await DestinationFaq.find({destination: d._id})
            const monthContent = await DestinationMonthContent.find({destination: d._id})
            const monthFaq = await DestinationMonthFaq.find({destination: d._id});
            let weatherData = null;
            if (startDate && endDate) {
                weatherData = await fetchWeatherData(d.stationID, startDate as string, endDate as string);
            }

            data.push({
                destination: d,
                content: content,
                faq: faq,
                monthContent: monthContent,
                monthFaq: monthFaq,
                weatherData: weatherData,
            })
        }))

        cache.set('d-al', data);

        return NextResponse.json({success: true, data: data})

    }catch(error: any) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "server error"});
    }
}