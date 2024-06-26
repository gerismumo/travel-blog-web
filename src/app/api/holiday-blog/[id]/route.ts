import { HolidayBlog } from "@/(models)/models";
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
        const body = await req.json();
        const {heading , info, image, content} = body;

        if(!heading ||!info ||!image ||content.length === 0) {
            return Response.json({success: false, message: "all fields are required"})
        }
        await connectDB();
        const updateData = await HolidayBlog.findByIdAndUpdate(params.id, {
            heading:heading,
            info:info,
            image:image,
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