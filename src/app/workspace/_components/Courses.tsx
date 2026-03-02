"use client"

import React, { useEffect } from 'react'
import { Sparkles, BookOpen, ChevronRight, Plus, CheckCircle2, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import AddNewCourseDialogue from './AddNewCourseDialogue'

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
    <div className="relative mt-4 flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-20 text-center">
      
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />

      <div className="relative mb-8">
        <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-[2rem] border border-white/10 bg-[#13131a] text-5xl shadow-2xl shadow-violet-500/10">
          🚀
        </div>
        <div className="absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full bg-violet-500/20 blur-sm" />
      </div>

      <div className="relative z-10 max-w-sm">
        <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-white">
            Your Dashboard is <span className="text-violet-400 italic font-medium tracking-normal">Awaiting Orders</span>
        </h3>
        <p className="mb-10 text-[0.9rem] leading-relaxed text-white/30 font-light">
            You haven't architected any courses yet. Turn your curiosity into a structured learning roadmap in seconds.
        </p>
      </div>

      <AddNewCourseDialogue>
        <Button className="group relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-8 text-sm font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] active:scale-95">
          <Sparkles className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
          Generate My First Course
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </Button>
      </AddNewCourseDialogue>
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