import { type NextRequest, NextResponse } from "next/server"
import { courseDB } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await courseDB.findById(params.id)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json(course)
  } catch (error) {
    console.error("MongoDB Error:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedCourse = await courseDB.updateById(params.id, body)
    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("MongoDB Error:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await courseDB.deleteById(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("MongoDB Error:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
