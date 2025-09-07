"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Plus, BookOpen, Users, Search } from "lucide-react"
import { CourseForm } from "@/components/course-form"
import { CourseCard } from "@/components/course-card"
import { CourseDetails } from "@/components/course-details"
import { AIRecommendations } from "@/components/ai-recommendations"
import type { Course } from "@/lib/database"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses(courses)
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCourses(filtered)
    }
  }, [courses, searchTerm])

  const fetchCourses = async () => {
    try {
      console.log("[v0] Fetching courses...")
      setLoading(true)
      const response = await fetch("/api/courses")
      console.log("[v0] Fetch response status:", response.status)
      if (!response.ok) throw new Error("Failed to fetch courses")
      const data = await response.json()
      console.log("[v0] Fetched courses:", data)
      setCourses(data)
      if (data.length > 0) {
        toast({
          title: "Connected to MongoDB Atlas",
          description: "Courses loaded successfully from database.",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to fetch courses:", error)
      toast({
        title: "Database Connection Error",
        description: "Please check your MongoDB Atlas connection and MONGODB_URI environment variable.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = () => {
    console.log("[v0] Opening create course form")
    setEditingCourse(null)
    setIsFormOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    console.log("[v0] Opening edit course form for:", course.title)
    setEditingCourse(course)
    setIsFormOpen(true)
    setSelectedCourse(null)
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      console.log("[v0] Deleting course with ID:", courseId)
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      })
      console.log("[v0] Delete response status:", response.status)
      if (!response.ok) throw new Error("Failed to delete course")

      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId))
      setSelectedCourse(null)
      console.log("[v0] Course deleted successfully")
      toast({
        title: "Success",
        description: "Course deleted successfully from MongoDB Atlas.",
      })
    } catch (error) {
      console.error("[v0] Failed to delete course:", error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = async (courseData: Omit<Course, "_id" | "createdAt" | "updatedAt">) => {
    try {
      console.log("[v0] Submitting course data:", courseData)
      if (editingCourse) {
        console.log("[v0] Updating existing course:", editingCourse._id)
        const response = await fetch(`/api/courses/${editingCourse._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        })
        console.log("[v0] Update response status:", response.status)
        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] Update error response:", errorData)
          throw new Error("Failed to update course")
        }

        const updatedCourse = await response.json()
        console.log("[v0] Updated course received:", updatedCourse)
        setCourses((prevCourses) =>
          prevCourses.map((course) => (course._id === editingCourse._id ? updatedCourse : course)),
        )
        toast({
          title: "Success",
          description: "Course updated successfully in MongoDB Atlas.",
        })
      } else {
        console.log("[v0] Creating new course")
        const response = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        })
        console.log("[v0] Create response status:", response.status)
        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] Create error response:", errorData)
          throw new Error("Failed to create course")
        }

        const newCourse = await response.json()
        console.log("[v0] New course created:", newCourse)
        setCourses((prevCourses) => [...prevCourses, newCourse])
        toast({
          title: "Success",
          description: "Course created successfully in MongoDB Atlas.",
        })
      }
      setIsFormOpen(false)
      setEditingCourse(null)
      console.log("[v0] Form submission completed successfully")
    } catch (error) {
      console.error("[v0] Failed to save course:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? "update" : "create"} course. Please try again.`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your courses</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={showRecommendations ? "default" : "outline"}
              onClick={() => setShowRecommendations(!showRecommendations)}
            >
              <span className="mr-2">🤖</span>
              AI Recommendations
            </Button>
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>

        {showRecommendations && (
          <div className="mb-8">
            <AIRecommendations onCourseSelect={(course) => setSelectedCourse(course)} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((sum, course) => sum + course.enrolledStudents, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <div className="text-2xl">⭐</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.length > 0
                  ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={() => handleEditCourse(course)}
              onDelete={() => handleDeleteCourse(course._id)}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No courses match your search</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          </div>
        )}

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first course</p>
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </div>
        )}

        {selectedCourse && (
          <CourseDetails
            course={selectedCourse}
            onEdit={() => handleEditCourse(selectedCourse)}
            onDelete={() => handleDeleteCourse(selectedCourse._id)}
            onClose={() => setSelectedCourse(null)}
          />
        )}

        {isFormOpen && (
          <CourseForm
            course={editingCourse}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingCourse(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
