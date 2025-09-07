import { MongoClient, type Db, type Collection } from "mongodb"

let client: MongoClient
let db: Db

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  if (client && db) {
    return { db, client }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local")
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    db = client.db("course_management")

    console.log("Connected to MongoDB Atlas")
    return { db, client }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function getCoursesCollection(): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection("courses")
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close()
    console.log("MongoDB connection closed")
  }
}
