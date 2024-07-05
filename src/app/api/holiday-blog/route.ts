import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlog } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const body:IHolidayBlog = await req.json();
       

        const {category, overViewHeading, coverImage, overViewDescription, metaTitle, metaDescription, metaKeyWords, month , WeatherHolidayContent, OtherHolidayContent} =body;
        cache.del("hBg");
        await connectDB();

        if (!category || !overViewHeading || !coverImage || !overViewDescription || !metaTitle || !metaDescription || !metaKeyWords ) {
            return Response.json({success: false, message: 'All fields are required.' });
        }

        const newHolidayBlog = await HolidayBlog.create({
            category: category,
            overViewHeading: overViewHeading,
            coverImage: coverImage,
            overViewDescription: overViewDescription,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            month: month,
            WeatherHolidayContent: WeatherHolidayContent.length === 0 ? [] : WeatherHolidayContent,
            OtherHolidayContent: OtherHolidayContent.length === 0 ? []: OtherHolidayContent
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
        cache.set("hBg", hBg)
        return Response.json({ success: true, data: hBg });
    }catch(error) {
        return Response.json({ success: false, message:'server error' });
    }
}