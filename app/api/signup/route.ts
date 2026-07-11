import { NextRequest , NextResponse } from "next/server";
import {prisma} from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req : NextRequest) {
    const {email, password, username} = await req.json();

    if(!email || !password || !username) {
        return NextResponse.json({message : "Missing required fields"}, {status : 400});
    }

    const existingUser = await prisma.user.findFirst({
        where :{
            OR:
        [{email}, { username }] ,
        },

    });

    if(existingUser) {
        return NextResponse.json({message : "User already exists"}, {status : 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json({message : "User created successfully", user}, {status : 201});

}
