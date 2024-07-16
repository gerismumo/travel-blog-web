import { DestinationContent } from "@/(models)/models";
import { IDestinationContent } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const formData = await req.formData()

        const destination = formData.get('destination')?.toString();
        const weatherInfo = formData.get('weatherInfo')?.toString();
        const destinationInfo = formData.get('destinationInfo')?.toString();
        const metaTitle = formData.get('metaTitle')?.toString();
        const metaDescription = formData.get('metaDescription')?.toString();
        const metaKeyWords = formData.get('metaKeywords')?.toString();
        const image = formData.get('image')as File | null ;

        console.log('formdata',formData)

        console.log("image",image);
        

        if(!destination ||!weatherInfo ||!destinationInfo || !image || !metaTitle || !metaDescription || !metaKeyWords) {
            return NextResponse.json({ success: false, message: 'Fill all fields' });
        }

        const imageBuffer = await image.arrayBuffer();
        console.log("Image buffer: " + imageBuffer);

        console.log("insert image", Buffer.from(imageBuffer).toString("base64"))
        //

        await connectDB();

        const existingData = await DestinationContent.findOne({destination});
        if(existingData) {
            return NextResponse.json({ success: false, message: 'record already exists' });
        }

        const savedData = await DestinationContent.create({destination, weatherInfo, destinationInfo, image: Buffer.from(imageBuffer), metaTitle, metaDescription,metaKeyWords});
        if(savedData) {
            cache.del("destinationContent");
            return NextResponse.json({ success: true, message: 'Added successfully' });
        }else {
            return NextResponse.json({ success: false, message:'something went wrong' });
        }
    }catch(error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'server error' });
    }
}

export async function GET(req:NextRequest) {
    try{
        const cachedData = cache.get("destinationContent")
        if(cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        await connectDB();
        const destinationContent = await DestinationContent.find();
        cache.set("destinationContent",destinationContent)
        return NextResponse.json({ success: true, data: destinationContent });
    }catch(error) {
        return NextResponse.json({ success: false, message:'server error' });
    }
}