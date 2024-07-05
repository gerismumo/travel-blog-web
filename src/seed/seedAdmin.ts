import { Users } from "@/(models)/models";
import connectDB from "@/utils/dbConnect";
import mongoose from "mongoose";

async function seeAdmin () {
    await connectDB();

    const email = "geraldmumo@gmail.com";
    const password = "0000";
    const role = "admin";

    const user = await Users.findOne({ email });

    if(user) {
        console.log("Admin already exists.");
        return;
    }

    //insert
    if(!email || !password || !role) {
        console.log("All fields are required.");
        return;
    }

    try {
        const newUser = await Users.create({ email, password, role });
        if(newUser) {
            console.log("Admin created successfully.");
        }
    }catch(error: any) {
        console.error('Error seeding admin user:', error);
    }finally {
        await mongoose.connection.close();
    }
}

seeAdmin();