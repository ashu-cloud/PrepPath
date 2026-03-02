"use client"

import React, { useEffect } from 'react'
import { Sparkles, BookOpen, ChevronRight, Plus, CheckCircle2, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface Course {
  id: string
  title: string
  description?: string
  modules?: number
  level?: string
  progress: number // <-- We added progress here!
}

const levelStyle: Record<string, string> = {
  Beginner:     'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400',
  Intermediate: 'border-amber-500/30  bg-amber-500/[0.06]  text-amber-400',
  Advanced:     'border-red-400/30    bg-red-400/[0.06]    text-red-400',
}

function CourseCard({ course }: { course: Course }) {
  const badgeStyle = course.level && levelStyle[course.level] ? levelStyle[course.level] : 'border-gray-500/30 bg-gray-500/[0.06] text-gray-400';
  const isFinished = course.progress === 100;

  return (
    <Link
      href={`/workspace/edit-course/${course.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#13131a] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${
          isFinished ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-white/[0.07] hover:border-violet-500/30 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${isFinished ? "bg-emerald-500/10" : "bg-violet-500/[0.1]"}`}>
          {isFinished ? '🏆' : '📚'}
        </div>
        {course.level && (
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.08em] ${badgeStyle}`}>
            {course.level}
          </span>
        )}
      </div>

      <h3 className="mb-1.5 font-display text-[0.95rem] font-bold leading-snug tracking-tight text-white line-clamp-1">
        {course.title}
      </h3>

      {course.description && (
        <p className="mb-4 line-clamp-2 text-[0.8rem] leading-relaxed text-white/30">
          {course.description}
        </p>
      )}

      {/* --- PROGRESS BAR UI --- */}
      <div className="mt-auto pt-4 w-full border-t border-white/5">
         <div className="mb-2 flex justify-between items-center text-[0.65rem] font-semibold tracking-wider uppercase">
             <span className="text-white/40 flex items-center gap-1">
                 <BookOpen className="h-3 w-3" /> {course.modules} Modules
             </span>
             <span className={isFinished ? "text-emerald-400" : "text-violet-400"}>
                 {course.progress}%
             </span>
         </div>
         <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
             <div 
                 className={`h-full rounded-full transition-all duration-1000 ${isFinished ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'}`}
                 style={{ width: `${course.progress}%` }}
             />
         </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] text-2xl">📭</div>
      <h3 className="mb-2 font-display text-[1rem] font-bold text-white/60">No courses yet</h3>
      <p className="mb-6 max-w-[280px] text-[0.82rem] leading-relaxed text-white/25">
        Generate your first AI course tailored to your knowledge level and start learning today.
      </p>
      <Link href="/workspace/create" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]">
        <Sparkles className="h-3.5 w-3.5" /> Generate your first course
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
          
          const formattedData = res.data.map((c: any) => ({
            id: c.cid,
            title: c.name,
            description: c.description,
            modules: c.numberOfModules,
            level: c.difficultyLevel,
            progress: c.progress || 0 // Default to 0 if undefined
          }))
          
          setCourseList(formattedData)
        } catch (error) {
          console.error("Failed to fetch courses:", error)
        }
      }
      fetchCourses()
    }
  }, [user])

  // Filter the courses into the two categories
  const activeCourses = courseList.filter(c => c.progress < 100);
  const completedCourses = courseList.filter(c => c.progress === 100);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
            <span className="h-px w-5 bg-violet-400" /> My Learning
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Dashboard
          </h1>
        </div>
        {/* <Link href="/workspace/" className="flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[0.8rem] text-white/80 transition-all hover:bg-white/5 hover:text-white">
          <Plus className="h-4 w-4" /> New Course
        </Link> */}
      </div>

      {courseList.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-12">
            
          {/* --- RESUME COURSES SECTION --- */}
          {activeCourses.length > 0 && (
              <div>
                  <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-violet-400" /> Resume Learning
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {activeCourses.map((course) => <CourseCard key={course.id} course={course} />)}
                  </div>
              </div>
          )}

          {/* --- COMPLETED COURSES SECTION --- */}
          {completedCourses.length > 0 && (
              <div>
                  <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Completed Courses
                      </h2>
                      <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-80 hover:opacity-100 transition-opacity">
                    {completedCourses.map((course) => <CourseCard key={course.id} course={course} />)}
                  </div>
              </div>
          )}

        </div>
      )}
    </div>
  )
}

export default Courses