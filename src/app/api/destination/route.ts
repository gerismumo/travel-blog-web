import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/dbConnect';
import { Destination } from '@/(models)/models';
import { IDestination, IDestinationList } from '@/(types)/type';
import cache from '@/utils/cache';


export  async function POST(req: NextRequest) {

  const body = await req.json();
  const {destination, stationId, countryCode} = body;
  
  if (!destination || !countryCode) {
    return NextResponse.json({ success: false, message: 'All fields are required' });
  }

  try {
    await connectDB();

    const result = await Destination.create({name: destination, countryCode: countryCode, stationID: stationId});

    if(result) {
      return NextResponse.json({success: true,  message: 'inserted successfully'});
    }else {
      return NextResponse.json({success: false,  message: 'something went wrong'});
    }
  } catch (error: any) {
    return NextResponse.json({ success: false,  message: 'Error inserting data'});
  }
}


export async function GET(req: NextRequest) {
  try {
    const cachedData = cache.get("destinations");

    if (cachedData) return NextResponse.json({ success: true, data: cachedData });
    
    await connectDB(); 
    const destinations = await Destination.find({});
    cache.set("destinations", destinations);
    return NextResponse.json({ success: true, data: destinations });
  } catch (err: any) { 
    return NextResponse.json({ success: false, message: 'Error retrieving destinations' });
  }
}



// const destinationsData = [
//   { name: "Dubai", countryCode: "AE", stationID: 41196 },
//   { name: "Abu Dhabi", countryCode: "AE", stationID: 41200 },
//   { name: "Sharjah", countryCode: "AE", stationID: 41197 },
//   { name: "Ajman", countryCode: "AE", stationID: 41198 },
//   { name: "Al Ain", countryCode: "AE", stationID: 41199 },
//   { name: "New York", countryCode: "US", stationID: 72503 },
//   { name: "London", countryCode: "GB", stationID: 2643743 },
//   { name: "Paris", countryCode: "FR", stationID: 2988507 },
//   { name: "Sydney", countryCode: "AU", stationID: 2147714 },
//   { name: "Agadir", countryCode: "MA", stationID: 2526435 },
//   { name: "Antalya", countryCode: "TR", stationID: 323776 },
//   { name: "Barcelona", countryCode: "ES", stationID: 3128760 },
//   { name: "Benidorm", countryCode: "ES", stationID: 2521088 },
//   { name: "Bodrum", countryCode: "TR", stationID: 320214 },
//   { name: "Cancun", countryCode: "MX", stationID: 3531673 },
//   { name: "Cappadocia", countryCode: "TR", stationID: 314907 },
//   { name: "Corfu, Ionian Islands", countryCode: "GR", stationID: 2463679 },
//   { name: "Costa Brava", countryCode: "ES", stationID: 6356745 },
//   { name: "Costa Del Sol (Benalmadena, Malaga, Marbella)", countryCode: "ES", stationID: 6355452 },
//   { name: "Costa Dorada (Salou – Port Aventura)", countryCode: "ES", stationID: 3110967 },
//   { name: "Crete, Aegean Islands", countryCode: "GR", stationID: 6697805 },
//   { name: "Dalaman (Marmaris, Olu Deniz, Fethiye)", countryCode: "TR", stationID: 317109 },
//   { name: "Dubrovnik and Islands", countryCode: "HR", stationID: 3201047 },
//   { name: "Fuerteventura, Canary Islands", countryCode: "ES", stationID: 2512210 },
//   { name: "Gran Canaria", countryCode: "ES", stationID: 2515270 },
//   { name: "Hammamet", countryCode: "TN", stationID: 2473575 },
//   { name: "Hurghada", countryCode: "EG", stationID: 361291 },
//   { name: "Ibiza", countryCode: "ES", stationID: 2516479 },
//   { name: "Istanbul", countryCode: "TR", stationID: 745044 },
//   { name: "Izmir (Kusadasi)", countryCode: "TR", stationID: 311044 },
//   { name: "Kos, Dodecanese Islands", countryCode: "GR", stationID: 259245 },
//   { name: "La Palma", countryCode: "ES", stationID: 2514651 },
//   { name: "Lanzarote", countryCode: "ES", stationID: 2512186 },
//   { name: "Larnaca", countryCode: "CY", stationID: 146384 },
//   { name: "Majorca", countryCode: "ES", stationID: 2512989 },
//   { name: "Maldives", countryCode: "MV", stationID: 1282028 },
//   { name: "Malta", countryCode: "MT", stationID: 2562770 },
//   { name: "Marrakech", countryCode: "MA", stationID: 2542997 },
//   { name: "Mauritius", countryCode: "MU", stationID: 934154 },
//   { name: "Menorca", countryCode: "ES", stationID: 2514268 },
//   { name: "Mykonos, Cyclades Islands", countryCode: "GR", stationID: 257056 },
//   { name: "Paphos", countryCode: "CY", stationID: 146214 },
//   { name: "Punta Cana Area", countryCode: "DO", stationID: 3494242 },
//   { name: "Rhodes, Dodecanese Islands", countryCode: "GR", stationID: 400666 },
//   { name: "Rome", countryCode: "IT", stationID: 3169070 },
//   { name: "Santorini", countryCode: "GR", stationID: 252923 },
//   { name: "Sharm El Sheikh", countryCode: "EG", stationID: 667116 },
//   { name: "Split", countryCode: "HR", stationID: 3190261 },
//   { name: "Tenerife", countryCode: "ES", stationID: 2510376 }
// ]