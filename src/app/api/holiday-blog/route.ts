import { DestinationContent, DestinationMonthContent, HolidayBlog } from "@/(models)/models";
import { IHolidayBlog } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { uploadToMinio } from "@/utils/uploadToMinio";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config({path: '../../../../.env'});

export async function POST(req:NextRequest) {
    try {
      const formData = await req.formData();

      //get the otherHolidayContent
      const otherHolidayContent: any = [];
      formData.forEach((value, key) => {
        if (key.startsWith('OtherHolidayContent')) {
          const match = key.match(/OtherHolidayContent\[(\d+)\]\.(.*)/);
          if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
  
            if (!otherHolidayContent[index]) {
              otherHolidayContent[index] = {};
            }
  
            otherHolidayContent[index][field] = value;
          }
        } 
      });
      //get the other keys
      const category = formData.get('category');
      const overViewHeading = formData.get('overViewHeading');
      let coverImage = formData.get('coverImage');
      const heading = formData.get('heading');
      let image = formData.get('image');
      const overViewDescription = formData.get('overViewDescription');        
      const metaTitle = formData.get('metaTitle');
      const metaDescription = formData.get('metaDescription');
      const metaKeyWords = formData.get('metaKeyWords');
      const destination = formData.get('destination');
      const otherCategory = formData.get('otherCategory');
      const month = formData.get('month');
      const WeatherHolidayContent = formData.get('WeatherHolidayContent');
      const parsedWeatherHolidayContent = WeatherHolidayContent ? JSON.parse(WeatherHolidayContent as string) : [];


      if (!category || !overViewHeading || !coverImage  || !metaTitle || !metaDescription || !metaKeyWords ) {
        return Response.json({success: false, message: 'All fields are required.' });
      }

      cache.del("hBg");
      //image insert to minio

      // coverImage
      let  CoverImageName;
        try {
            const uploadResponse = await uploadToMinio({
                bucketName: 'blogs',
                file: coverImage as File,
                folder: 'weather'
            });
            CoverImageName = uploadResponse.fileName;
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
        }

        if(!process.env.IMAGE_URL) {
          return NextResponse.json({ success: false, message: 'Error occured, try again later' });
      }
      //image url
      coverImage = `${process.env.IMAGE_URL}/blogs/${CoverImageName}`

      if(image) {
        let  ImageName;
        try {
            const uploadResponse = await uploadToMinio({
                bucketName: 'blogs',
                file: image as File,
                folder: 'weather'
            });
            ImageName = uploadResponse.fileName;
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
        }

        if(!process.env.IMAGE_URL) {
          return NextResponse.json({ success: false, message: 'Error occured, try again later' });
      }
      //image url
      image = `${process.env.IMAGE_URL}/blogs/${ImageName}`
      }

      //generate image url for each subimage
      if (otherHolidayContent.length > 0) {
        for (const c of otherHolidayContent) {
          let subImage = c.subImage;
      
          if (subImage) {
            let subImageName;
            try {
              const uploadResponse = await uploadToMinio({
                bucketName: 'blogs',
                file: subImage as File,
                folder: 'weather'
              });
              subImageName = uploadResponse.fileName;
            } catch (error) {
              return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
            }
      
            subImage = `${process.env.IMAGE_URL}/blogs/${subImageName}`;
          }
      
          c.subImage = subImage;
        }
      }

      //submit the data to the database
        await connectDB();

        const newHolidayBlog = await HolidayBlog.create({
            category: category,
            overViewHeading: overViewHeading,
            coverImage: coverImage,
            heading: heading,
            image: image,
            overViewDescription: overViewDescription,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            destination: destination,
            otherCategory: otherCategory,
            month: month,
            WeatherHolidayContent: parsedWeatherHolidayContent.length === 0 ? [] : parsedWeatherHolidayContent,
            OtherHolidayContent:  otherCategory === "month" || otherHolidayContent.length === 0 ? []: otherHolidayContent
        });

        if(newHolidayBlog) {
            return Response.json({ success: true, message: 'Holiday blog added successfully.' });
        }else {
            return Response.json({ success: false, message: 'Something went wrong.' });
        }
    } catch (error: any) {
        console.log(error);
        return Response.json({ success: false, message: 'server error' });
    }
}

export async function GET(req:Request) {
    try{
        const cachedData = cache.get("hBg");
        if(cachedData) {
            return Response.json({ success: true, data: cachedData });
        }
        
        await connectDB();
        const hBg = await HolidayBlog.find();

       const data = await Promise.all(hBg.map(async (d) => {
            if (d.WeatherHolidayContent.length === 0) {
              return d;
            }
          
            const promises = d.WeatherHolidayContent.map(async (weatherHolidayItem: any) => {
              const wi = await DestinationMonthContent.findOne({
                destination: weatherHolidayItem.destination,
                month: d.month,
              });
              const di = await DestinationContent.findOne({
                destination: weatherHolidayItem.destination,
              });
          
              return {
                destination: weatherHolidayItem.destination,
                text: weatherHolidayItem.text,
                _id: weatherHolidayItem._id,
                weatherInfo: wi ? wi.weatherInfo : null,
                image: di ? di.image : null,
              };
            });
          
            const updatedWeatherHolidayContent = await Promise.all(promises);
            // console.log(updatedWeatherHolidayContent)
            return { ...d.toObject(), WeatherHolidayContent: updatedWeatherHolidayContent };
          }));

          
        
        cache.set("hBg", data)
       
        return Response.json({ success: true, data: data });
    }catch(error) {
        return Response.json({ success: false, message:'server error' });
    }
}