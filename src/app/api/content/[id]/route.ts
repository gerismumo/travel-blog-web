import { DestinationContent } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { deleteFromMinio, uploadToMinio } from "@/utils/uploadToMinio";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
dotenv.config({path: '../../../../../.env'});


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        cache.flushAll();

        await connectDB(); 

        const existingData = await DestinationContent.findById(params.id);
        if(!existingData) {
            return NextResponse.json({ success: false, message: "data not found" })
        }

        //obtain the image url
        const urlObject = new URL(existingData.image);
        const pathname = urlObject.pathname;
        const desiredImgStr = pathname.replace('/blogs/', '');

        try {
            const bucketName = 'blogs';
            const fileName = desiredImgStr;
            await deleteFromMinio({ bucketName, fileName });
            
            //update the new image
        } catch (error) {
            return NextResponse.json({ success: false, message: 'error occured, try again later' });
        }

        const deleteData = await DestinationContent.findByIdAndDelete(params.id);
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
        const destination = formData.get('destination')?.toString();
        const weatherInfo = formData.get('weatherInfo')?.toString();
        const destinationInfo = formData.get('destinationInfo')?.toString();
        const metaTitle = formData.get('metaTitle')?.toString();
        const metaDescription = formData.get('metaDescription')?.toString();
        const metaKeyWords = formData.get('metaKeywords')?.toString();
        const image = formData.get('image') as File | string | null;

     //get esixting data
        const existingData = await DestinationContent.findById(params.id);
        if(!existingData) {
            return NextResponse.json({ success: false, message: "data not found" })
        }

        

        //obtain the image url
        const urlObject = new URL(existingData.image);
        const pathname = urlObject.pathname;
        const desiredImgStr = pathname.replace('/blogs/', '');

        let etag, ImageName;
        if(typeof image === "object") {
            //delete existing image from minio
            try {
                const bucketName = 'blogs';
                const fileName = desiredImgStr;
                await deleteFromMinio({ bucketName, fileName });
                
                //update the new image
                const uploadResponse = await uploadToMinio({
                    bucketName: 'blogs',
                    file: image as File,
                    folder: 'weather'
                });
                etag = uploadResponse.etag;
                ImageName = uploadResponse.fileName;
            } catch (error) {
                return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
            }
        }

        if(!process.env.IMAGE_URL) {
            return NextResponse.json({ success: false, message: 'Error occured, try again later' });
        }

        const imageUrl = `${process.env.IMAGE_URL}/blogs/${ImageName}`
        
        cache.flushAll();
        
        await connectDB();

        const updatedData = await DestinationContent.findByIdAndUpdate(params.id, {
            destination: destination,
            weatherInfo: weatherInfo,
            destinationInfo:destinationInfo,
            image: typeof image === "object" ? imageUrl : image,
            metaTitle:metaTitle,
            metaDescription: metaDescription,
            metaKeyWords:metaKeyWords
        }, {new: true});
        
        if(updatedData) {
            return Response.json({success: true, message: "update success"})
        } else {
            return Response.json({success: false, message: "update failed"})
        }

    }catch(error: any) {
        console.log(error.message)
        return Response.json({success: false, message: "server error"})
    }
}

export async function GET(req: Request,{params}: {params: {id: string}}){
    try{
        const id = params.id;
        //cache data
        const cachedData = cache.get("data");
        if(cachedData) {
            return NextResponse.json({success: true, data: cachedData});
        }

        if (!id) {
            return NextResponse.json({ success: false, message: 'Invalid destination ID' });
        }

        await connectDB();
        const data = await DestinationContent.find({destination: id})
        //set cache
        cache.set("data", data);

        return NextResponse.json({success: true, data:data })
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}