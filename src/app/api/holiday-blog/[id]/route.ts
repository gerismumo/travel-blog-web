import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlogList } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    try {
        cache.del("hBg");
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
        

        await connectDB();

        const updateData = await HolidayBlog.findById(params.id);
        if (!updateData) {
            return Response.json({ success: false, message: "Document not found" });
        }

       
        updateData.category = body.category;
        updateData.overViewHeading = body.overViewHeading;
        updateData.coverImage = body.coverImage;
        updateData.overViewDescription = body.overViewDescription;
        updateData.metaTitle = body.metaTitle;
        updateData.metaDescription = body.metaDescription;
        updateData.metaKeyWords = body.metaKeyWords;
        updateData.destination = body.destination;
        updateData.otherCategory = body.otherCategory;
        updateData.month = body.month;
        updateData.WeatherHolidayContent = body.WeatherHolidayContent;
        updateData.OtherHolidayContent = body.OtherHolidayContent;

        await updateData.save();

        return Response.json({ success: true, message: "Update success" });

    }catch(error) {
        return Response.json({success:false, message: "server error"})
    }
}