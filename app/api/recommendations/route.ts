import { type NextRequest, NextResponse } from "next/server"
import { courseDB } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await courseDB.seedInitialData()
    const recommendations = await courseDB.getRecommendations(body)
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("MongoDB Recommendations Error:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
