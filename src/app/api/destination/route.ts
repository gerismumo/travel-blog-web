import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/dbConnect';
import { Destination } from '@/(models)/destination';
import { IDestination, IDestinationList } from '@/(types)/type';

export async function POST(req: NextRequest) {
  const body:IDestination = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ success: false, message: 'Fill all fields' }); 
  }

  try {
    await connectDB(); 
    await Destination.create({name});
    return NextResponse.json({ success: true, message: 'Added successfully' }); 
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Error adding destination' }); 
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB(); 
    const destinations = await Destination.find({});
    return NextResponse.json({ success: true, data: destinations });
  } catch (err: any) { 
    return NextResponse.json({ success: false, message: 'Error retrieving destinations' });
  }
}
