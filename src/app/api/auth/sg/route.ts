import { Users } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const {email, password} =body;
        
        if(!email ||!password) {
            return Response.json({ success: false, message: "all fields are required" });
        }
        //find
        await connectDB();
        
        const existingUser = await Users.findOne({email: email});

        if(!existingUser) {
            return Response.json({ success: false, message: "email not found" });
        }

        //check password match

        if(existingUser.password !== password) {
            return Response.json({ success: false, message: "password incorrect" });
        }

        const id = existingUser._id;
        const user_email = existingUser.email;

        //login user & generate jwt
        const user = {
            id,
            user_email
        }
        
        cookies().set({
            name: 'user',
            value:JSON.stringify({user}),
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 24* 1000),
            maxAge: 60 * 60 * 24 ,
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          });

        return Response.json({success: true, message: "login successful"});
    }catch(error: any) {
        console.log(error);
        return Response.json({success: false, message: "server error"})
    }
}