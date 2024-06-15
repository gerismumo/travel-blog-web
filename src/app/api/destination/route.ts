import { NextRequest, NextResponse } from 'next/server';
import Destination from '@/(models)/destination';
import connectDB from '@/utils/dbConnect';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ success: false, message: 'Fill all fields' }); 
  }

  try {
    await connectDB(); 
    await Destination.create({name});
    return NextResponse.json({ success: true, message: 'Added successfully' }); 
  } catch (err: any) {
    console.error(`Error creating destination: ${err.message}`);
    return NextResponse.json({ success: false, message: 'Error adding destination' }); 
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB(); 
    const destinations = await Destination.find({});
    return NextResponse.json({ success: true, destinations });
  } catch (err: any) {
    console.error(`Error retrieving destinations: ${err.message}`);
    return NextResponse.json({ success: false, message: 'Error retrieving destinations' });
  }
}
