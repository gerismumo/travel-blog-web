import { Users } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function POST() {
    try {
        await connectDB();
        seedAdmin()
    }catch(error: any) {
        throw new Error(error.message);
    }
}


 async function seedAdmin() {
    try {
        await connectDB();
        const email = "geraldmumo@gmail.com";
        const password = "0000";
        const role = "admin";

        if (!email || !password || !role) {
            console.log("All fields are required.");
            return;
        }

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            
            return;
        }

        const newUser = await Users.create({ email, password, role });

        if (newUser) {
            console.log("Admin created successfully.");
        }
    } catch (error: any) {
        console.error('Error seeding admin user:', error);
    } finally {
        await mongoose.connection.close();
    }
}