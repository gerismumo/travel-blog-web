import { Destination, DestinationContent, DestinationFaq, DestinationMonthContent, DestinationMonthFaq, Weather } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
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
            const faq = await DestinationFaq.findOne({destination: d._id})
            const monthContent = await DestinationMonthContent.find({destination: d._id})
            const monthFaq = await DestinationMonthFaq.find({destination: d._id});
            const weatherData = await Weather.find({destination: d._id});
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
        return NextResponse.json({success:false, message: `server error, ${error.message}`});
    }
}