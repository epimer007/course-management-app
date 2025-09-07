import { type NextRequest, NextResponse } from "next/server"
import { courseDB } from "@/lib/database"

export async function GET() {
  try {
    await courseDB.seedInitialData()
    const courses = await courseDB.findAll()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("MongoDB Error:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCourse = await courseDB.create(body)
    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error("MongoDB Error:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
