"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import type { Course } from "@/lib/database"

interface AIRecommendationsProps {
  onCourseSelect?: (course: Course) => void
}

export function AIRecommendations({ onCourseSelect }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    level: "Any level",
    category: "",
    maxPrice: "",
  })

  useEffect(() => {
    getRecommendations()
  }, [])

  const getRecommendations = async (userPrefs?: typeof preferences) => {
    setLoading(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPrefs || {}),
      })
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error("Failed to get recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (field: string, value: string) => {
    const newPrefs = { ...preferences, [field]: value }
    setPreferences(newPrefs)
  }

  const applyPreferences = () => {
    const filteredPrefs = {
      level: preferences.level === "Any level" ? undefined : preferences.level,
      category: preferences.category || undefined,
      maxPrice: preferences.maxPrice ? Number.parseFloat(preferences.maxPrice) : undefined,
    }
    getRecommendations(filteredPrefs)
  }

  const resetPreferences = () => {
    setPreferences({ level: "Any level", category: "", maxPrice: "" })
    getRecommendations()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <CardTitle className="text-xl">AI Course Recommendations</CardTitle>
        </div>
        <CardDescription>Get personalized course suggestions based on ratings and popularity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <span>⚙️</span>
            Customize Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level-select">Skill Level</Label>
              <Select value={preferences.level} onValueChange={(value) => handlePreferenceChange("level", value)}>
                <SelectTrigger id="level-select">
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any level">Any level</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-input">Category</Label>
              <Input
                id="category-input"
                value={preferences.category}
                onChange={(e) => handlePreferenceChange("category", e.target.value)}
                placeholder="e.g., Web Development"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-input">Max Price ($)</Label>
              <Input
                id="price-input"
                type="number"
                value={preferences.maxPrice}
                onChange={(e) => handlePreferenceChange("maxPrice", e.target.value)}
                placeholder="Any price"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={applyPreferences} size="sm" disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <span className="mr-2">🔍</span>}
              Get Recommendations
            </Button>
            <Button onClick={resetPreferences} variant="outline" size="sm">
              Reset
            </Button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Recommended for You</h3>
            <Badge variant="secondary">AI Powered</Badge>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Finding best courses...</span>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((course, index) => (
                <Card
                  key={course._id}
                  className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20"
                  onClick={() => onCourseSelect?.(course)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1} Recommended
                          </Badge>
                          <Badge variant="secondary">{course.level}</Badge>
                        </div>
                        <h4 className="font-semibold text-card-foreground mb-1">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👥</span>
                            <span>{course.enrolledStudents.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{course.duration}h</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">${course.price}</div>
                        <div className="text-xs text-muted-foreground">{course.category}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🤖</span>
              <h3 className="font-medium text-foreground mb-2">No recommendations found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your preferences to get better matches</p>
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <span>💡</span>
              <h4 className="font-medium">AI Insights</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              These courses are recommended based on high ratings, enrollment trends, and positive student feedback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
