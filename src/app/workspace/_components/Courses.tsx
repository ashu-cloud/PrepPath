"use client"

import React, { useEffect } from 'react'
import { Sparkles, BookOpen, Clock, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface Course {
  id: string
  title: string
  description?: string
  topic?: string
  duration?: string
  modules?: number
  progress?: number
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | string
}

const levelStyle: Record<string, string> = {
  Beginner:     'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400',
  Intermediate: 'border-amber-500/30  bg-amber-500/[0.06]  text-amber-400',
  Advanced:     'border-red-400/30    bg-red-400/[0.06]    text-red-400',
}

function CourseCard({ course }: { course: Course }) {
  const badgeStyle = course.level && levelStyle[course.level] ? levelStyle[course.level] : 'border-gray-500/30 bg-gray-500/[0.06] text-gray-400';

  return (
    <Link
      href={`/workspace/edit-course/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.1)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.07), transparent 70%)' }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/[0.1] text-lg">
          📚
        </div>
        {course.level && (
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.08em] ${badgeStyle}`}>
            {course.level}
          </span>
        )}
      </div>

      <h3 className="mb-1.5 font-display text-[0.95rem] font-bold leading-snug tracking-tight text-white">
        {course.title}
      </h3>

      {course.description && (
        <p className="mb-4 line-clamp-2 text-[0.8rem] leading-relaxed text-white/30">
          {course.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-[0.72rem] text-white/20">
          {course.modules && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.modules} modules
            </span>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-violet-400" />
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] text-2xl">
        📭
      </div>
      <h3 className="mb-2 font-display text-[1rem] font-bold text-white/60">
        No courses yet
      </h3>
      <p className="mb-6 max-w-[280px] text-[0.82rem] leading-relaxed text-white/25">
        Generate your first AI course tailored to your knowledge level and start learning today.
      </p>
      <Link
        href="/workspace/generate"
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Generate your first course
      </Link>
    </div>
  )
}

function Courses() {
  const { user } = useUser()
  const [courseList, setCourseList] = React.useState<Course[]>([])

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const fetchCourses = async () => {
        try {
          const email = user.primaryEmailAddress!.emailAddress
          const res = await axios.get(`/api/courses?email=${email}`)
          
          // Map database structure to UI structure
          const formattedData = res.data.map((c: any) => ({
            id: c.cid,
            title: c.name,
            description: c.description,
            modules: c.numberOfModules,
            level: c.difficultyLevel
          }))
          
          setCourseList(formattedData)
        } catch (error) {
          console.error("Failed to fetch courses:", error)
        }
      }
      fetchCourses()
    }
  }, [user])

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
            <span className="h-px w-5 bg-violet-400" />
            My Learning
          </p>
          <h1 className="font-display text-[1.6rem] font-extrabold tracking-tight text-white">
            My Courses
          </h1>
        </div>

        <Link
          href="/workspace/create"
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[0.8rem] text-white/60 transition-all hover:border-violet-500/30 hover:text-violet-300"
        >
          <Plus className="h-3.5 w-3.5" />
          New Course
        </Link>
      </div>

      {courseList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courseList.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

export default Courses