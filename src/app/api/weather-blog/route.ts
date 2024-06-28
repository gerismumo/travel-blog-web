import { DestinationWeatherBlog } from "@/(models)/models";
import { IWeatherBlog } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";

export async function POST(req: Request) {
    try{
        const body:IWeatherBlog = await req.json();
        const {destination, heading, image} =body;
        
        if(!destination ||!heading ||!image) {
            return Response.json({ success: false, message: "All fields are required" });
        }

        // save data to your database here
       await connectDB();

       const existingData = await DestinationWeatherBlog.findOne({destination:destination});
       if(existingData) {
        return Response.json({ success: false, message: "Record already exists" });
       }

        const savedData = await DestinationWeatherBlog.create(body);
        if(savedData) {
            return Response.json({ success: true, message: " added successfully" });
        } else {
            return Response.json({ success: false, message: "Something went wrong" });
        }
    }catch(error) {
        return Response.json({ success: false, message: "server error" });
    }
}

export async function GET() {
    try {
        await connectDB();
        const weatherBlogs = await DestinationWeatherBlog.find();
        return Response.json({ success: true, data: weatherBlogs });
    }catch(error) {
        return Response.json({ success: false, message: "server error" });
    }
}