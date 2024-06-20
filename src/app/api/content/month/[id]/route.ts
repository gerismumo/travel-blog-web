
import { DestinationMonthContent } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        await connectDB(); 
        const deleteData = await DestinationMonthContent.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "delete failed"})
    }
}


export async function PUT(req: Request, {params}: {params: {id: string}}) {

    try{
        const body = await req.json();

        const {destinationId, month, weatherInfo} = body;

        if(destinationId === "" || month === "" || weatherInfo === "") {
            return Response.json({success: false, message: "all fields are required"})
        }
        
        await connectDB();

        let updateData;
        const existingRecord = await DestinationMonthContent.findOne({ destinationId, month });
        if(existingRecord) {
            updateData = await DestinationMonthContent.findByIdAndUpdate(params.id, 
                {
                    weatherInfo: body.weatherInfo,
                },
                {new: true}
            )
            return Response.json({ success: true, message: 'Record with same date updated' });

        }else {
            updateData = await DestinationMonthContent.findByIdAndUpdate(params.id, {
                destinationId, month, weatherInfo
            }, {new: true});
        }

        if (updateData) {
            return Response.json({ success: true, message: 'Updated successfully' });
          } else {
            return Response.json({ success: false, message: 'Something went wrong' });
          } 
    }catch(error) {
        return Response.json({success: false, message: "server error"})
    }
}