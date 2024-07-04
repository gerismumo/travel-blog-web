
import { ThingsToDo } from "@/(models)/models";
import { IThingsToDo } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";

export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        cache.del("ttd");
        await connectDB(); 
        const deleteData = await ThingsToDo.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "delete failed"})
    }
}


export async function PUT(req:Request, {params}: {params: {id: string}}) { 
    try{
        const body:IThingsToDo = await req.json();
        const {destination,overviewHeading, overviewDescription, image, metaTitle, metaDescription, metaKeyWords, placesToVisit} =body;

        if(!destination || !overviewHeading || !overviewDescription || !image || !metaTitle || !metaDescription || !metaKeyWords || placesToVisit.length === 0) {
            return Response.json({success: false, message: "all fields are required"})
        }

        cache.del("ttd");
        await connectDB();

        const updatedData = await ThingsToDo.findByIdAndUpdate(params.id, {
            destination: destination,
            overviewHeading: overviewHeading,
            overviewDescription: overviewDescription,
            image: image,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            placesToVisit: placesToVisit
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

