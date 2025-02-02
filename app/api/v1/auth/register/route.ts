import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconfig";
import User from "@/models/User";

// http://localhost:3000/api/v1/auth/register

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Please provide email and password" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        )
    }
}
