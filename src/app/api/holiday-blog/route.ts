import { DestinationContent, DestinationMonthContent, HolidayBlog } from "@/(models)/models";
import { IHolidayBlog } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const body:IHolidayBlog = await req.json();
       

        const {category, overViewHeading, coverImage, heading, image, overViewDescription, metaTitle, metaDescription, metaKeyWords, destination, otherCategory, month , WeatherHolidayContent, OtherHolidayContent} =body;
        cache.del("hBg");
        await connectDB();

        if (!category || !overViewHeading || !coverImage  || !metaTitle || !metaDescription || !metaKeyWords ) {
            return Response.json({success: false, message: 'All fields are required.' });
        }

        const newHolidayBlog = await HolidayBlog.create({
            category: category,
            overViewHeading: overViewHeading,
            coverImage: coverImage,
            heading: heading,
            image: image,
            overViewDescription: overViewDescription,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            destination: destination,
            otherCategory: otherCategory,
            month: month,
            WeatherHolidayContent: WeatherHolidayContent.length === 0 ? [] : WeatherHolidayContent,
            OtherHolidayContent:  otherCategory === "month" || OtherHolidayContent.length === 0 ? []: OtherHolidayContent
        });

        if(newHolidayBlog) {
            return Response.json({ success: true, message: 'Holiday blog added successfully.' });
        }else {
            return Response.json({ success: false, message: 'Something went wrong.' });
        }
    } catch (error: any) {
        console.log(error);
        return Response.json({ success: false, message: 'server error' });
    }
}

export async function GET(req:Request) {
    try{
        const cachedData = cache.get("hBg");
        if(cachedData) {
            return Response.json({ success: true, data: cachedData });
        }
        
        await connectDB();
        const hBg = await HolidayBlog.find();

       const data = await Promise.all(hBg.map(async (d) => {
            if (d.WeatherHolidayContent.length === 0) {
              return d;
            }
          
            const promises = d.WeatherHolidayContent.map(async (weatherHolidayItem: any) => {
              const wi = await DestinationMonthContent.findOne({
                destination: weatherHolidayItem.destination,
                month: d.month,
              });
              const di = await DestinationContent.findOne({
                destination: weatherHolidayItem.destination,
              });
          
              return {
                destination: weatherHolidayItem.destination,
                text: weatherHolidayItem.text,
                _id: weatherHolidayItem._id,
                weatherInfo: wi ? wi.weatherInfo : null,
                image: di ? di.image : null,
              };
            });
          
            const updatedWeatherHolidayContent = await Promise.all(promises);
            console.log(updatedWeatherHolidayContent)
            return { ...d.toObject(), WeatherHolidayContent: updatedWeatherHolidayContent };
          }));

          
        
        cache.set("hBg", data)
       
        return Response.json({ success: true, data: data });
    }catch(error) {
        return Response.json({ success: false, message:'server error' });
    }
}