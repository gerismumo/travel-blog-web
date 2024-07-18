import { NewsBlog } from "@/(models)/models";
import { INews, ISubNews } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { uploadToMinio } from "@/utils/uploadToMinio";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config({path: '../../../../.env'});


export async function POST(req:NextRequest) {
    try {
        const formData = await req.formData();
        const heading = formData.get('heading');
        const info = formData.get('info');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const metaKeyWords = formData.get('metaKeyWords');
        let image = formData.get('image');

        if(!heading || !info || !image ) {
            return Response.json({ success: false, message: 'all fields are required' });
        }

        cache.del("news");

        const subNews: any = [];

        formData.forEach((value, key) => {
            if (key.startsWith('subNews')) {
              const match = key.match(/subNews\[(\d+)\]\.(.*)/);
              if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
      
                if (!subNews[index]) {
                  subNews[index] = {};
                }
      
                subNews[index][field] = value;
              }
            } 
          });

          if(!process.env.IMAGE_URL) {
            return NextResponse.json({ success: false, message: 'Error occured, try again later' });
        }

          //handle upload images
          try {
            const uploadResponse = await uploadToMinio({
                bucketName: 'blogs',
                file: image as File,
                folder: 'weather'
            });
            image = `${process.env.IMAGE_URL}/blogs/${uploadResponse.fileName}`

            if(subNews.length > 0) {
                for (const d of subNews) {
                    let subImage = d.subImage;

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
                    d.subImage = subImage;
                }
            }
          }catch(error: any) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
          }
        await connectDB();
        const newNews = await NewsBlog.create({heading, image, info, metaTitle, metaDescription, metaKeyWords, subNews});

        if(newNews) {
            return Response.json({ success: true, message: 'News added successfully' });
        } else {
            return Response.json({ success: false, message: 'Failed to add news' });
        }
    }catch(error) {
        return Response.json({ success: false, message: 'Server error' });
    }
}


export async function GET() {
    try {
        const cachedData = cache.get("news");
        if(cachedData) {
            return Response.json({ success: true, data: cachedData });
        }
        await connectDB();
        const data = await NewsBlog.find();

        cache.set("news", data);
        return Response.json({success: true, data: data})
    }catch(error) {
        return Response.json({ success: false, message: 'Server error' });
    }
}