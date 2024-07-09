import { Users } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server';


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
        
        return Response.json({success: true, message: "login successful"});
    }catch(error: any) {
        console.log(error);
        return Response.json({success: false, message: "server error"})
    }
}