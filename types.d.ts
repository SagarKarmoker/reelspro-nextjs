import { Connection } from "mongoose"

// global object
declare global {
    var mongoose: {
        conn: Connection | null
        promise: Promise<Connection> | null
    }
}

export {};