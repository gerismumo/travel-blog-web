import { DestinationContent, DestinationMonthContent } from "@/(models)/models";

export async function GET(req: Request)  {
    try {
        const { searchParams } = new URL(req.url);
        const destination = searchParams.get('destination');
        const month = searchParams.get('month');

        if (!destination ||!month) {
            return Response.json({ success: false, message: 'error occured' });
        }

        const mc = await DestinationMonthContent.findOne({destination: destination, month: month});
        const ic = await DestinationContent.findOne({destination: destination});
        

        const data = {
            destination,
            month,
            image : ic?.image || null,
            weatherInfo: mc?.weatherInfo || null
        }
        
        return Response.json({ success: true, data: data });

    }catch (error) {
        return Response.json({ success: false, message: 'Server error' });
    }
}