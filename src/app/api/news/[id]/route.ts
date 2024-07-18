

import { NewsBlog } from "@/(models)/models";
import { INewsList } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { deleteFromMinio, uploadToMinio } from "@/utils/uploadToMinio";

dotenv.config({path: '../../../../../.env'});


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        cache.del("news");
        await connectDB(); 

        const existingData = await NewsBlog.findById(params.id);
        if(!existingData) {
            return Response.json({success: false, message: "Data not found"})
        }

        try {
            const desiredImgStr = new URL(existingData.image).pathname.replace('/blogs/', '');

            if(existingData.image) {
                await deleteFromMinio({ bucketName: 'blogs', fileName: desiredImgStr });
            }

            if(existingData.subNews.length > 0) {
                for(const c of existingData.subNews) {
                    const SubImagStr = new URL(c?.subImage).pathname.replace('/blogs/', '');
                    try {
                        await deleteFromMinio({ bucketName: 'blogs', fileName: SubImagStr });
                    }catch(error) {
                        return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
                    }
                    
                }
            }
        }catch(error: any) {
            return NextResponse.json({ success: false, message: 'error occured, try again later' });
        }

        const deleteData = await NewsBlog.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "delete failed"})
    }
}


export async function PUT(req:NextRequest, {params}: {params: {id: string}}) { 
    try{

        const formData = await req.formData();
        const heading = formData.get('heading');
        const info = formData.get('info');
        let image = formData.get('image');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const metaKeyWords = formData.get('metaKeyWords');

        
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


        if(!heading || !image ) {
            return Response.json({success: false, message: "all fields are required"})
        }

        cache.del("news");

        // console.log(subNews);

        if(!process.env.IMAGE_URL) {
            return NextResponse.json({ success: false, message: 'Error occured, try again later' });
        }

        await connectDB();
        //get existing data
        const existingData =await NewsBlog.findById(params.id);
        if(!existingData) {
            return Response.json({ success: false, message: "Data not found"})
        }

        try {
            const ImagStr = new URL(existingData.image).pathname.replace('/blogs/', '');
            await deleteFromMinio({ bucketName: 'blogs', fileName: ImagStr });

            if(image && typeof image === 'object') {
                const uploadResponse = await uploadToMinio({
                    bucketName: 'blogs',
                    file: image as File,
                    folder: 'weather'
                });
                image = `${process.env.IMAGE_URL}/blogs/${uploadResponse.fileName}`
            }
           

            if(subNews.length > 0) {
                for (const d of subNews) {
                    let subImage = d.subImage;

                    if (typeof subImage === 'object') {
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


        const updatedData = await NewsBlog.findByIdAndUpdate(params.id, {
            heading: heading,
            info: info,
            image: image,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            subNews: subNews
        }, {new: true});
        
        if(updatedData) {
            return Response.json({success: true, message: "update success"})
        } else {
            return Response.json({success: false, message: "update failed"})
        }
    }catch(error) {
        return Response.json({success: false, message: "server error"})
    }
}

