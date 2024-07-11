import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST () {
    try{
        cookies().delete("user");
        return NextResponse.json({ success: true, message: "Successfully logged out" });
    }catch(error: any) {
        return NextResponse.json({success: false, message: "server error"})
    }
}