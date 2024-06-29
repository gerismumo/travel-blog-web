import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlogList } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    try {
        await connectDB(); 
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
        const body:IHolidayBlogList = await req.json();
        const {heading , info, image, content, metaDescription, metaTitle, metaKeyWords} = body;

        if(!heading ||!info ||!image ||content.length === 0) {
            return Response.json({success: false, message: "all fields are required"})
        }
        await connectDB();
        const updateData = await HolidayBlog.findByIdAndUpdate(params.id, {
            heading:heading,
            info:info,
            image:image,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            content:content
        }, {new: true});

        if(updateData) {
            return Response.json({success: true, message: "update success"})
        } else {
            return Response.json({success: false, message: "update failed"})
        }

    }catch(error) {
        return Response.json({success:false, message: "server error"})
    }
}