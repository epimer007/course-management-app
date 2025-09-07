"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { X } from "lucide-react"
import type { Course } from "@/lib/database"

interface CourseFormProps {
  course?: Course | null
  onSubmit: (courseData: Omit<Course, "_id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
  loading?: boolean
}

export function CourseForm({ course, onSubmit, onCancel, loading = false }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: 0,
    level: "Beginner" as Course["level"],
    category: "",
    price: 0,
    rating: 0,
    enrolledStudents: 0,
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        duration: course.duration,
        level: course.level,
        category: course.category,
        price: course.price,
        rating: course.rating,
        enrolledStudents: course.enrolledStudents,
        tags: course.tags,
      })
    }
  }, [course])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.instructor.trim()) newErrors.instructor = "Instructor is required"
    if (formData.duration <= 0) newErrors.duration = "Duration must be greater than 0"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (formData.price < 0) newErrors.price = "Price cannot be negative"
    if (formData.rating < 0 || formData.rating > 5) newErrors.rating = "Rating must be between 0 and 5"
    if (formData.enrolledStudents < 0) newErrors.enrolledStudents = "Enrolled students cannot be negative"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{course ? "Edit Course" : "Create New Course"}</CardTitle>
          <CardDescription>
            {course ? "Update the course information below" : "Fill in the details to create a new course"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter course title"
                  className={errors.title ? "border-destructive" : ""}
                  required
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => handleInputChange("instructor", e.target.value)}
                  placeholder="Instructor name"
                  className={errors.instructor ? "border-destructive" : ""}
                  required
                />
                {errors.instructor && <p className="text-sm text-destructive">{errors.instructor}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Course description"
                rows={3}
                className={errors.description ? "border-destructive" : ""}
                required
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="1"
                  className={errors.duration ? "border-destructive" : ""}
                  required
                />
                {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="e.g., Web Development"
                  className={errors.category ? "border-destructive" : ""}
                  required
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                  className={errors.price ? "border-destructive" : ""}
                  required
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                  min="0"
                  max="5"
                  className={errors.rating ? "border-destructive" : ""}
                  required
                />
                {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrolledStudents">Enrolled Students</Label>
                <Input
                  id="enrolledStudents"
                  type="number"
                  value={formData.enrolledStudents}
                  onChange={(e) => handleInputChange("enrolledStudents", Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className={errors.enrolledStudents ? "border-destructive" : ""}
                  required
                />
                {errors.enrolledStudents && <p className="text-sm text-destructive">{errors.enrolledStudents}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <LoadingSpinner size="sm" className="mr-2" />}
                {course ? "Update Course" : "Create Course"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
