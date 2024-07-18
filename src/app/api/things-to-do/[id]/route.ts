
import { ThingsToDo } from "@/(models)/models";
import { IThingsToDo } from "@/(types)/type";
import cache from "@/utils/cache";
import connectDB from "@/utils/dbConnect";
import { deleteFromMinio, uploadToMinio } from "@/utils/uploadToMinio";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:Request, {params}: {params: {id: string}}) {
    try {
        cache.del("ttd");
        await connectDB(); 

        const existingData = await ThingsToDo.findById(params.id);
        if(!existingData) {
            return Response.json({success: false, message: "Data not found"})
        }

        try {
            const desiredImgStr = new URL(existingData.image).pathname.replace('/blogs/', '');

            if(existingData.image) {
                await deleteFromMinio({ bucketName: 'blogs', fileName: desiredImgStr });
            }

            if(existingData.placesToVisit.length > 0) {
                for(const c of existingData.placesToVisit) {
                    const SubImagStr = new URL(c?.image).pathname.replace('/blogs/', '');
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

        const deleteData = await ThingsToDo.findByIdAndDelete(params.id);
        if(deleteData) {
            return Response.json({success: true, message: "delete success"})
        } else {
            return Response.json({success: false, message: "delete failed"})
        }
    } catch (error) {
        return Response.json({success: false, message: "delete failed"})
    }
}


export async function PUT(req:NextRequest, {params}: {params: {id: string}}) { 
    try{
        const formData = await req.formData();
        const destination = formData.get('destination');
        const overviewHeading = formData.get('overviewHeading');
        const overviewDescription = formData.get('overviewDescription');
        let image = formData.get('image');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const metaKeyWords = formData.get('metaKeyWords');

        const placesToVisit: any = [];
        formData.forEach((value, key) => {
            if (key.startsWith('placesToVisit')) {
              const match = key.match(/placesToVisit\[(\d+)\]\.(.*)/);
              if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
      
                if (!placesToVisit[index]) {
                    placesToVisit[index] = {};
                }
      
                placesToVisit[index][field] = value;
              }
            } 
        });


        if(!destination || !overviewHeading || !overviewDescription || !image || !metaTitle || !metaDescription || !metaKeyWords || placesToVisit.length === 0) {
            return Response.json({success: false, message: "all fields are required"})
        }


        if(!process.env.IMAGE_URL) {
            return NextResponse.json({ success: false, message: 'Error occured, try again later' });
        }

        cache.del("ttd");
        await connectDB();
        //get existing data
        const existingData =await ThingsToDo.findById(params.id);
        if(!existingData) {
            return Response.json({ success: false, message: "Data not found"})
        }


        try {
            const ImagStr = new URL(existingData.image).pathname.replace('/blogs/', '');
            await deleteFromMinio({ bucketName: 'blogs', fileName: ImagStr });

            if(image && typeof image === 'object') {
                const uploadResponse = await uploadToMinio({
                    bucketName: 'blogs',
                    file: image as File,
                    folder: 'weather'
                });
                image = `${process.env.IMAGE_URL}/blogs/${uploadResponse.fileName}`
            }
           

            if(placesToVisit.length > 0) {
                for (const d of placesToVisit) {
                    let subImage = d.image;

                    if (typeof subImage === 'object') {
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
                    d.image = subImage;
                }
            }
          }catch(error: any) {
            return NextResponse.json({ success: false, message: 'Image upload failed, try again later' });
          }



        const updatedData = await ThingsToDo.findByIdAndUpdate(params.id, {
            destination: destination,
            overviewHeading: overviewHeading,
            overviewDescription: overviewDescription,
            image: image,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyWords: metaKeyWords,
            placesToVisit: placesToVisit
        }, {new: true});
        
        if(updatedData) {
            return NextResponse.json({success: true, message: "update success"})
        } else {
            return NextResponse.json({success: false, message: "update failed"})
        }
    }catch(error) {
        return NextResponse.json({success: false, message: "server error"})
    }
}

