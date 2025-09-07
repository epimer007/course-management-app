"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Edit, Trash2 } from "lucide-react"
import type { Course } from "@/lib/database"

interface CourseCardProps {
  course: Course
  onEdit: () => void
  onDelete: () => void
  onClick?: () => void
}

export function CourseCard({ course, onEdit, onDelete, onClick }: CourseCardProps) {
  const getLevelVariant = (level: string) => {
    switch (level) {
      case "Beginner":
        return "default"
      case "Intermediate":
        return "secondary"
      case "Advanced":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">by {course.instructor}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

        <div className="flex gap-2">
          <Badge variant={getLevelVariant(course.level)}>{course.level}</Badge>
          <Badge variant="outline">{course.category}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrolledStudents.toLocaleString()}</span>
          </div>
          <span className="text-lg font-semibold text-primary">${course.price}</span>
        </div>
      </CardContent>
    </Card>
  )
}
