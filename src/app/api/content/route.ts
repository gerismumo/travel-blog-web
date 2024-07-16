import { DestinationContent } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { uploadToMinio } from "@/utils/uploadToMinio";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config({path: '../../../../.env'});


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

        //check values
        if(!destination ||!weatherInfo ||!destinationInfo || !image || !metaTitle || !metaDescription || !metaKeyWords) {
            return NextResponse.json({ success: false, message: 'Fill all fields' });
        }

        //upload image to minio
        let etag, fileName;
        try {
            const uploadResponse = await uploadToMinio({
                bucketName: 'blogs',
                file: image,
                folder: 'weather'
            });
            etag = uploadResponse.etag;
            fileName = uploadResponse.fileName;
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
        }

        if(!process.env.IMAGE_URL) {
            return NextResponse.json({ success: false, message: 'Error occured, try again later' });
        }
        //image url
        const imageUrl = `${process.env.IMAGE_URL}/blogs/${fileName}`
      

        await connectDB();

        const existingData = await DestinationContent.findOne({destination});
        if(existingData) {
            return NextResponse.json({ success: false, message: 'record already exists' });
        }

        const savedData = await DestinationContent.create({destination, weatherInfo, destinationInfo, image: imageUrl, metaTitle, metaDescription,metaKeyWords});
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