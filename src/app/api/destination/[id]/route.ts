import { Destination } from "@/(models)/models";
import connectDB from "@/utils/dbConnect"

export async function PUT(req:Request, {params}: {params: {id: string}}) {
    try {
        const body = await req.json();
        const {stationId} =body;
        if(!stationId) {
            return Response.json({success: false, message: "all fields are required"})
        }
        if(!params.id) {
            return Response.json({success: false, message: "error occurred"})
        }
        await connectDB();
        const updatedData = await Destination.findByIdAndUpdate(params.id, {
            stationID: stationId
        }, {new: true});

        if(updatedData){
            return Response.json({success: true, message: "update success"})
        }else {
            return Response.json({success: false, message: "update failed"})
        }
    }catch(error) {
        console.log(error);
        return Response.json({success: false, message: "server error"})
    }
}