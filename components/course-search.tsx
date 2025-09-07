"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, SortAsc, SortDesc } from "lucide-react"
import type { Course } from "@/lib/database"

interface CourseSearchProps {
  courses: Course[]
  onFilteredCoursesChange: (courses: Course[]) => void
}

export function CourseSearch({ courses, onFilteredCoursesChange }: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [priceRange, setPriceRange] = useState("all")

  const categories = Array.from(new Set(courses.map((course) => course.category)))
  const levels = ["Beginner", "Intermediate", "Advanced"]

  const applyFilters = () => {
    let filtered = [...courses]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    // Price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "free":
          filtered = filtered.filter((course) => course.price === 0)
          break
        case "under50":
          filtered = filtered.filter((course) => course.price > 0 && course.price < 50)
          break
        case "50to100":
          filtered = filtered.filter((course) => course.price >= 50 && course.price <= 100)
          break
        case "over100":
          filtered = filtered.filter((course) => course.price > 100)
          break
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Course]
      let bValue: any = b[sortBy as keyof Course]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    onFilteredCoursesChange(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedLevel("all")
    setSelectedCategory("all")
    setSortBy("title")
    setSortOrder("asc")
    setPriceRange("all")
    onFilteredCoursesChange(courses)
  }

  const hasActiveFilters = searchTerm || selectedLevel !== "all" || selectedCategory !== "all" || priceRange !== "all"

  // Apply filters whenever any filter changes
  useState(() => {
    applyFilters()
  })

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Search & Filter Courses</h3>
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-auto">
            {courses.length} results
          </Badge>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, instructors, or tags..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            applyFilters()
          }}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          value={selectedLevel}
          onValueChange={(value) => {
            setSelectedLevel(value)
            applyFilters()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value)
            applyFilters()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value)
            applyFilters()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="under50">Under $50</SelectItem>
            <SelectItem value="50to100">$50 - $100</SelectItem>
            <SelectItem value="over100">Over $100</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value)
              applyFilters()
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="enrolledStudents">Students</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              applyFilters()
            }}
          >
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="outline">
                Search: "{searchTerm}"
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSearchTerm("")
                    applyFilters()
                  }}
                />
              </Badge>
            )}
            {selectedLevel !== "all" && (
              <Badge variant="outline">
                Level: {selectedLevel}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSelectedLevel("all")
                    applyFilters()
                  }}
                />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="outline">
                Category: {selectedCategory}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory("all")
                    applyFilters()
                  }}
                />
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge variant="outline">
                Price: {priceRange}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setPriceRange("all")
                    applyFilters()
                  }}
                />
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
