import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const { searchParams } = req.nextUrl;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    if (!lat || !lon) {
        return NextResponse.json({ success: false, message: 'Latitude and Longitude are required' }, { status: 400 });
      }

    try {
    const response = await fetch(`https://d.meteostat.net/app/nearby?lat=${lat}&lon=${lon}&lang`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }
    
    return NextResponse.json({ success: true, data: data.data });

    } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}