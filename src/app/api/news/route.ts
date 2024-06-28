import { NewsBlog } from "@/(models)/models";
import { INews } from "@/(types)/type";
import connectDB from "@/utils/dbConnect";

export async function POST(req: Request) {
    try {
        const body:INews = await req.json();
        const {heading, image, info, subNews} =body;

        if(!heading || !info ) {
            return Response.json({ success: false, message: 'all fields are required' });
        }

        await connectDB();
        const newNews = await NewsBlog.create({heading, image, info, subNews});

        if(newNews) {
            return Response.json({ success: true, message: 'News added successfully' });
        } else {
            return Response.json({ success: false, message: 'Failed to add news' });
        }
    }catch(error) {
        return Response.json({ success: false, message: 'Server error' });
    }
}


export async function GET() {
    try {
        await connectDB();
        const data = await NewsBlog.find();
        
        return Response.json({success: true, data: data})
    }catch(error) {
        return Response.json({ success: false, message: 'Server error' });
    }
}