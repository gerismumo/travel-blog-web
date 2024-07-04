import { ThingsToDo } from "@/(models)/models";
import { IThingsToDo } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const body:IThingsToDo = await req.json();

        const {destination, overviewHeading, overviewDescription, image, metaTitle, metaDescription, metaKeyWords, placesToVisit } = body;
 
        if(!destination ||!overviewHeading ||!overviewDescription ||!image || !metaTitle || !metaDescription || !metaKeyWords || placesToVisit.length === 0) {
            return Response.json({ success: false, message: 'All fields are required' });
        }
        //save data
        cache.del("ttd");
        await connectDB();

        const existingData = await ThingsToDo.findOne({ destination:destination});

        if(existingData) {
            return Response.json({ success: false, message: 'Record already exists' });
        }

        const newThingsToDo = await ThingsToDo.create(body);
        
        if(newThingsToDo) {
            return Response.json({ success: true, message: 'Added successfully' });
        }else {
            return Response.json({ success: false, message: 'Something went wrong' });
        }

    }catch(error: any) {
        console.log(error)
        return Response.json({ success: false, message: 'Server error' });
    }
}

export async function GET() {
    try {
        const cachedData = cache.get("ttd");
        if(cachedData) {
            return Response.json({ success: true, data: cachedData });
        }
        await connectDB();
        const thingsToDos = await ThingsToDo.find();
        cache.set("ttd", thingsToDos)
        return Response.json({ success: true, data: thingsToDos });
    }catch(error: any) {
        return Response.json({ success: false, message:"server error" });
    }
}

