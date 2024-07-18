import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlogList } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { deleteFromMinio } from "@/utils/uploadToMinio";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    try {
        cache.del("hBg");
        await connectDB(); 

        const existingData = await HolidayBlog.findById(params.id);
        if(!existingData) {
            return Response.json({success: false, message: "Data not found"})
        }

        //delete images from minio
        try {
            const desiredImgStr = new URL(existingData.image).pathname.replace('/blogs/', '');
            const CoverImagStr = new URL(existingData.coverImage).pathname.replace('/blogs/', '');

            await deleteFromMinio({ bucketName: 'blogs', fileName: CoverImagStr });
            if(existingData.image) {
                await deleteFromMinio({ bucketName: 'blogs', fileName: desiredImgStr });
            }

            if(existingData.OtherHolidayContent.length > 0) {
                for(const c of existingData.OtherHolidayContent) {
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

        const deleteData = await HolidayBlog.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "server error"})
    }
}

export async function PUT(req: Request, {params}: {params: {id: string}}) {
    try {
        const body = await req.json();
        

        await connectDB();
        console.log(body);
        if(!body.category ||!body.overViewHeading || !body.coverImage  || !body.metaTitle || !body.metaDescription || !body.metaKeyWords) {
            return Response.json({success: false, message: "Fill the required fields"})
        }

        const updateData = await HolidayBlog.findByIdAndUpdate(
            params.id,
            {
                $set: {
                    category: body.category,
                    overViewHeading: body.overViewHeading,
                    coverImage: body.coverImage,
                    heading: body.heading,
                    image: body.image,
                    overViewDescription: body.overViewDescription,
                    metaTitle: body.metaTitle,
                    metaDescription: body.metaDescription,
                    metaKeyWords: body.metaKeyWords,
                    destination: body.destination,
                    otherCategory: body.otherCategory,
                    month: body.month,
                    WeatherHolidayContent: body.WeatherHolidayContent,
                    OtherHolidayContent: body.OtherHolidayContent
                }
            },
            { new: true }
        );

        if (updateData) {
            return Response.json({ success: true, message: "update success" });
        } else {
            return Response.json({ success: false, message: "update failed" });
        }


    }catch(error) {
        return Response.json({success:false, message: "server error"})
    }
}