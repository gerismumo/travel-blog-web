import { ThingsToDo } from "@/(models)/models";
import { IThingsToDo } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { uploadToMinio } from "@/utils/uploadToMinio";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config({path: '../../../../.env'});

export async function POST(req:NextRequest) {
    try {

        const formData = await req.formData();
        const destination = formData.get('destination');
        const overviewHeading = formData.get('overviewHeading');
        const overviewDescription = formData.get('overviewDescription');
        let image = formData.get('image') as File | string | null;
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const metaKeyWords = formData.get('metaKeyWords');

        const placesToVisit: any = [];
        formData.forEach((value, key) => {
            if (key.startsWith('placesToVisit')) {
              const match = key.match(/placesToVisit\[(\d+)\]\.(.*)/);
              if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
      
                if (!placesToVisit[index]) {
                    placesToVisit[index] = {};
                }
      
                placesToVisit[index][field] = value;
              }
            } 
        });

        if(!process.env.IMAGE_URL) {
            return NextResponse.json({ success: false, message: 'Error occured, try again later' });
        }

        cache.del("ttd");

        try {
            const uploadResponse = await uploadToMinio({
                bucketName: 'blogs',
                file: image as File,
                folder: 'weather'
            });
            image = `${process.env.IMAGE_URL}/blogs/${uploadResponse.fileName}`

            if(placesToVisit.length > 0) {
                for (const d of placesToVisit) {
                    let subImage = d.image;

                    if (subImage) {
                        let subImageName;
                        try {
                            const uploadResponse = await uploadToMinio({
                            bucketName: 'blogs',
                            file: subImage as File,
                            folder: 'weather'
                            });
                            subImageName = uploadResponse.fileName;
                        } catch (error) {
                            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
                        }
                        subImage = `${process.env.IMAGE_URL}/blogs/${subImageName}`;
                    }
                    d.image = subImage;
                }
            }
          }catch(error: any) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
          }

        //save data
        
        await connectDB();

        const existingData = await ThingsToDo.findOne({ destination:destination});

        if(existingData) {
            return Response.json({ success: false, message: 'Record already exists' });
        }

        const newThingsToDo = await ThingsToDo.create({
            destination,
            overviewHeading,
            overviewDescription,
            image,
            metaTitle,
            metaDescription,
            metaKeyWords,
            placesToVisit: placesToVisit 
        });
        
        if(newThingsToDo) {
            return Response.json({ success: true, message: 'Added successfully' });
        }else {
            return Response.json({ success: false, message: 'Something went wrong' });
        }

    }catch(error: any) {
        console.log(error)
        return Response.json({ success: false, message: 'Server error' });
    }
}

export async function GET() {
    try {
        const cachedData = cache.get("ttd");
        if(cachedData) {
            return Response.json({ success: true, data: cachedData });
        }
        await connectDB();
        const thingsToDos = await ThingsToDo.find();
        cache.set("ttd", thingsToDos)
        return Response.json({ success: true, data: thingsToDos });
    }catch(error: any) {
        return Response.json({ success: false, message:"server error" });
    }
}

