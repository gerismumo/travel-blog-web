import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlog } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const body:IHolidayBlog = await req.json();

        const {category, month, heading, info, coverImage, image, metaTitle, metaDescription, metaKeyWords, content} =body;
        cache.del("hBg");
        await connectDB();

        if (!category || !heading || !info || !coverImage || !image || content.length === 0) {
            return Response.json({success: false, message: 'All fields are required.' });
        }

        const newHolidayBlog = await HolidayBlog.create({
            category: category,
            month: month,
            heading: heading,
            info: info,
            coverImage: coverImage,
            image: image,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            content: content
        });

        if(newHolidayBlog) {
            return Response.json({ success: true, message: 'Holiday blog added successfully.' });
        }else {
            return Response.json({ success: false, message: 'Something went wrong.' });
        }
    } catch (error: any) {
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