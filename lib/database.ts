import { ObjectId } from "mongodb"
import { getCoursesCollection } from "./mongodb"

export interface Course {
  _id?: string | ObjectId
  title: string
  description: string
  instructor: string
  duration: number // in hours
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  price: number
  rating: number
  enrolledStudents: number
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

class CourseDatabase {
  // CREATE
  async create(courseData: Omit<Course, "_id" | "createdAt" | "updatedAt">): Promise<Course> {
    const collection = await getCoursesCollection()
    const newCourse = {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newCourse)
    return {
      ...newCourse,
      _id: result.insertedId.toString(),
    }
  }

  // READ
  async findAll(): Promise<Course[]> {
    const collection = await getCoursesCollection()
    const courses = await collection.find({}).toArray()
    return courses.map((course) => ({
      ...course,
      _id: course._id.toString(),
    })) as Course[]
  }

  async findById(id: string): Promise<Course | null> {
    const collection = await getCoursesCollection()
    const course = await collection.findOne({ _id: new ObjectId(id) })
    if (!course) return null

    return {
      ...course,
      _id: course._id.toString(),
    } as Course
  }

  async findByCategory(category: string): Promise<Course[]> {
    const collection = await getCoursesCollection()
    const courses = await collection
      .find({
        category: { $regex: category, $options: "i" },
      })
      .toArray()

    return courses.map((course) => ({
      ...course,
      _id: course._id.toString(),
    })) as Course[]
  }

  // UPDATE
  async updateById(id: string, updateData: Partial<Omit<Course, "_id" | "createdAt">>): Promise<Course | null> {
    const collection = await getCoursesCollection()
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) return null

    return {
      ...result,
      _id: result._id.toString(),
    } as Course
  }

  // DELETE
  async deleteById(id: string): Promise<boolean> {
    const collection = await getCoursesCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // AI Recommendation logic
  async getRecommendations(userPreferences?: {
    level?: string
    category?: string
    maxPrice?: number
  }): Promise<Course[]> {
    const collection = await getCoursesCollection()
    const query: any = {}

    if (userPreferences) {
      if (userPreferences.level) {
        query.level = userPreferences.level
      }
      if (userPreferences.category) {
        query.category = { $regex: userPreferences.category, $options: "i" }
      }
      if (userPreferences.maxPrice !== undefined) {
        query.price = { $lte: userPreferences.maxPrice }
      }
    }

    // Sort by rating and enrollment for AI-like recommendations
    const courses = await collection.find(query).sort({ rating: -1, enrolledStudents: -1 }).limit(3).toArray()

    return courses.map((course) => ({
      ...course,
      _id: course._id.toString(),
    })) as Course[]
  }

  async seedInitialData(): Promise<void> {
    const collection = await getCoursesCollection()
    const count = await collection.countDocuments()

    if (count === 0) {
      const initialCourses = [
        {
          title: "Introduction to React",
          description: "Learn the fundamentals of React including components, state, and props.",
          instructor: "John Smith",
          duration: 20,
          level: "Beginner" as const,
          category: "Web Development",
          price: 99.99,
          rating: 4.5,
          enrolledStudents: 1250,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          tags: ["React", "JavaScript", "Frontend"],
        },
        {
          title: "Advanced Node.js",
          description: "Master backend development with Node.js, Express, and MongoDB.",
          instructor: "Sarah Johnson",
          duration: 35,
          level: "Advanced" as const,
          category: "Backend Development",
          price: 149.99,
          rating: 4.8,
          enrolledStudents: 890,
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-02-01"),
          tags: ["Node.js", "Express", "MongoDB", "Backend"],
        },
        {
          title: "Python for Data Science",
          description: "Comprehensive guide to data analysis and machine learning with Python.",
          instructor: "Dr. Michael Chen",
          duration: 45,
          level: "Intermediate" as const,
          category: "Data Science",
          price: 199.99,
          rating: 4.7,
          enrolledStudents: 2100,
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-20"),
          tags: ["Python", "Data Science", "Machine Learning"],
        },
      ]

      await collection.insertMany(initialCourses)
      console.log("Initial course data seeded to MongoDB")
    }
  }
}

export const courseDB = new CourseDatabase()
