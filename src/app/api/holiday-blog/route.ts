import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlog } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";

export async function POST(req:Request) {
    try {
        const body = await req.json();
        await connectDB();

        if (!body.category || !body.heading || !body.info || !body.image || body.content.length === 0) {
            return Response.json({success: false, message: 'All fields are required.' });
        }

        const newHolidayBlog = await HolidayBlog.create(body);

        if(newHolidayBlog) {
            return Response.json({ success: true, message: 'Holiday blog added successfully.' });
        }else {
            return Response.json({ success: false, message: 'Something went wrong.' });
        }
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: 'server error' });
    }
}

export async function GET(req:Request) {
    try{
        await connectDB();
        const holidayBlogs = await HolidayBlog.find();
        return Response.json({ success: true, data: holidayBlogs });
    }catch(error) {
        return Response.json({ success: false, message:'server error' });
    }
}