import { DestinationContent } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        await connectDB(); 
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


export async function PUT(req:Request, {params}: {params: {id: string}}) { 
    try{
        const body = await req.json();
        await connectDB();

        const updatedData = await DestinationContent.findByIdAndUpdate(params.id, {
            weatherInfo: body.weatherInfo,
            destinationInfo: body.destinationInfo,
            image: body.image,
            metaTitle: body.metaTitle,
            metaDescription: body.metaDescription,
            metaKeyWords: body.metaKeyWords
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