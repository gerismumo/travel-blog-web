import { DestinationContent } from "@/(models)/models";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextResponse } from "next/server";





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
        console.log('destination',body.destination)
        const exists = cache.has(body.destination);
        console.log('cache data',exists)

       

        await connectDB();

        const updatedData = await DestinationContent.findByIdAndUpdate(params.id, {
            weatherInfo: body.weatherInfo,
            category: body.category,
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

export async function GET(req: Request,{params}: {params: {id: string}}){
    try{
        const id = params.id;
        //cache data
        const cachedData = cache.get(id);
        if(cachedData) {
            console.log('cache hit')
            return NextResponse.json({success: true, data: cachedData});
        }

        if (!id) {
            return NextResponse.json({ success: false, message: 'Invalid destination ID' });
        }

        await connectDB();
        const data = await DestinationContent.find({destination: id})
        console.log('cahe exists');
        //set cache
        cache.set(id, data);

        return NextResponse.json({success: true, data:data })
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}