import { HolidayBlog } from "@/(models)/models";
import { IHolidayBlogList } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { deleteFromMinio, uploadToMinio } from "@/utils/uploadToMinio";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config({path: '../../../../../.env'});

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    try {
        cache.del("hBg");
        await connectDB(); 

        const existingData = await HolidayBlog.findById(params.id);
        if(!existingData) {
            return Response.json({success: false, message: "Data not found"})
        }

        //delete images from minio
        try {
            const desiredImgStr = new URL(existingData.image).pathname.replace('/blogs/', '');
            const CoverImagStr = new URL(existingData.coverImage).pathname.replace('/blogs/', '');

            await deleteFromMinio({ bucketName: 'blogs', fileName: CoverImagStr });
            if(existingData.image) {
                await deleteFromMinio({ bucketName: 'blogs', fileName: desiredImgStr });
            }

            if(existingData.OtherHolidayContent.length > 0) {
                for(const c of existingData.OtherHolidayContent) {
                    const SubImagStr = new URL(c?.subImage).pathname.replace('/blogs/', '');
                    try {
                        await deleteFromMinio({ bucketName: 'blogs', fileName: SubImagStr });
                    }catch(error) {
                        return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
                    }
                    
                }
            }
        }catch(error: any) {
            return NextResponse.json({ success: false, message: 'error occured, try again later' });
        }

        const deleteData = await HolidayBlog.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "server error"})
    }
}

export async function PUT(req: Request, {params}: {params: {id: string}}) {
    try {

        const formData = await req.formData();
        
        

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
        


        if(!category ||!overViewHeading || !coverImage  || !metaTitle || !metaDescription || !metaKeyWords) {
            return Response.json({success: false, message: "Fill the required fields"})
        }

        //upload image 
        const existingData =await HolidayBlog.findById(params.id);
        if(!existingData) {
            return Response.json({ success: false, message: "Data not found"})
        }

        try {
            if(!process.env.IMAGE_URL) {
                return NextResponse.json({ success: false, message: 'Error occured, try again later' });
            }
            
            if(typeof coverImage === 'object' && coverImage as File){
                const CoverImagStr = new URL(existingData.coverImage).pathname.replace('/blogs/', '');
                await deleteFromMinio({ bucketName: 'blogs', fileName: CoverImagStr });
                
                
                const uploadResponse = await uploadToMinio({
                    bucketName: 'blogs',
                    file: coverImage as File,
                    folder: 'weather'
                });
               coverImage =`${process.env.IMAGE_URL}/blogs/${uploadResponse.fileName}`
            }

            if(image && typeof image === 'object') {
                const ImagStr = new URL(existingData.image).pathname.replace('/blogs/', '');
                await deleteFromMinio({ bucketName: 'blogs', fileName: ImagStr });

                const uploadResponse = await uploadToMinio({
                    bucketName: 'blogs',
                    file: image as File,
                    folder: 'weather'
                });
               image =`${process.env.IMAGE_URL}/blogs/${uploadResponse.fileName}`
            }

            if(otherHolidayContent && otherHolidayContent.length > 0) {

                for (const c of otherHolidayContent) {
                    let subImage = c.subImage;

                    if(typeof subImage === 'object') {
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
                    // console.log('subimage',c.subImage)
                }
            }

        }catch(error: any) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
        }
        
        await connectDB();
       
        const updateData = await HolidayBlog.findByIdAndUpdate(
            params.id,
            {
                $set: {
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
                    WeatherHolidayContent: parsedWeatherHolidayContent,
                    OtherHolidayContent: otherHolidayContent,
                }
            },
            { new: true }
        );

        if (updateData) {
            return Response.json({ success: true, message: "update success" });
        } else {
            return Response.json({ success: false, message: "update failed" });
        }


    }catch(error: any) {
        console.log('error', error.message, error)
        return Response.json({success:false, message: "server error"})
    }
}