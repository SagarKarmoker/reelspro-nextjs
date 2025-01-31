import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
}

// global variable (types.d.ts)
// because nextjs run on serverless, we need to cache the connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function dbConnect() {
    // if connection is already cached, return it
    if (cached.conn) {
        return cached.conn;
    }

    // if connection is not cached, create
    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // buffer commands when connection is down
            maxPoolSize: 10, // max connect at a time
        }


        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then(() => mongoose.connection)
    }


    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw new Error("Error connecting to database")
    }

    return cached.conn;
}