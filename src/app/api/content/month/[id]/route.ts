
import { DestinationMonthContent } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";


export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        cache.flushAll();

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

        const {destinationId, month, weatherInfo, metaTitle, metaDescription,metaKeyWords} = body;

        if(destinationId === "" || month === "" || weatherInfo === "" || metaTitle ==="" || metaDescription === "" || metaKeyWords === "") {
            return Response.json({success: false, message: "all fields are required"})
        }
        
        cache.flushAll();
        
        await connectDB();

        let updateData;
        const existingRecord = await DestinationMonthContent.findOne({ destinationId, month });
        if(existingRecord) {
            updateData = await DestinationMonthContent.findByIdAndUpdate(params.id, 
                {
                    weatherInfo: body.weatherInfo,
                    metaTitle: body.metaTitle,
                    metaDescription: body.metaDescription,
                    metaKeyWords: body.metaKeyWords
                },
                {new: true}
            )
            return Response.json({ success: true, message: 'Record with same date updated' });

        }else {
            updateData = await DestinationMonthContent.findByIdAndUpdate(params.id, {
                destinationId, month, weatherInfo, metaTitle, metaDescription,metaKeyWords
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