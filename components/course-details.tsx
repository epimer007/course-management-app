"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Star, Users, Clock, DollarSign, Calendar, Tag, TrendingUp, BookOpen, Edit, Trash2, X } from "lucide-react"
import type { Course } from "@/lib/database"

interface CourseDetailsProps {
  course: Course
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function CourseDetails({ course, onEdit, onDelete, onClose }: CourseDetailsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const levelColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const handleDelete = () => {
    onDelete()
    onClose()
  }

  const totalRevenue = course.price * course.enrolledStudents
  const ratingPercentage = (course.rating / 5) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={levelColors[course.level]}>{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground mb-2">{course.title}</CardTitle>
              <CardDescription className="text-base">Instructed by {course.instructor}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Course Overview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Course Overview</h3>
            <p className="text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{course.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={ratingPercentage} className="w-16 h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{ratingPercentage.toFixed(0)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{course.enrolledStudents.toLocaleString()}</span>
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{course.duration}</span>
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">hours</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-primary">${course.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <Badge className={levelColors[course.level]}>{course.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{new Date(course.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Student Satisfaction</span>
                    <span className="text-sm font-medium">{course.rating}/5.0</span>
                  </div>
                  <Progress value={ratingPercentage} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Enrollment Rate</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Revenue Performance</span>
                    <span className="text-sm font-medium">${(totalRevenue / 1000).toFixed(1)}K</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Course Tags</h3>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-destructive">Delete Course</h4>
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this course? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
