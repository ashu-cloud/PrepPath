"use client"

import React, { useEffect } from 'react'
import { Sparkles, BookOpen, ChevronRight, Plus, CheckCircle2, PlayCircle, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import AddNewCourseDialogue from './AddNewCourseDialogue'
import useSWR from 'swr'


const fetcher = (url: string) => axios.get(url).then(res => res.data)

interface Course {
  id: string
  title: string
  description?: string
  modules?: number
  level?: string
  progress: number 
}

const levelStyle: Record<string, string> = {
  Beginner:     'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400',
  Intermediate: 'border-amber-500/30  bg-amber-500/[0.06]  text-amber-400',
  Advanced:     'border-red-400/30    bg-red-400/[0.06]    text-red-400',
}

function CourseCard({ course, refreshData }: { course: any, refreshData?: () => void }) {
  const badgeStyle = course.level && levelStyle[course.level] ? levelStyle[course.level] : 'border-gray-500/30 bg-gray-500/[0.06] text-gray-400';
  const isFinished = course.progress === 100;
  const isPending = course.status === 'pending';

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
        try {
            await axios.delete(`/api/delete-course?cid=${course.id}`);
            refreshData?.();
        } catch (error) {
            console.error("Delete failed", error);
        }
    }
  };

  return (
    <div className="relative group">
      {!isPending && (
        <button 
          onClick={handleDelete}
          className="absolute -right-2 -top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-[#070708] text-red-500 opacity-0 shadow-xl transition-all hover:bg-red-500 hover:text-white group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {isPending && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-[#0d0d12]/60 backdrop-blur-md border border-white/5 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-[0_0_25px_rgba(139,92,246,0.4)]">
               <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
          </div>
          <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.25em] text-violet-300/80 animate-pulse">
            Architecting Path
          </span>
          <div className="mt-3 flex gap-1.5">
             <div className="h-1 w-1 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]" />
             <div className="h-1 w-1 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.15s]" />
             <div className="h-1 w-1 rounded-full bg-violet-500 animate-bounce" />
          </div>
        </div>
      )}

      <Link
        href={isPending ? "#" : `/workspace/study/${course.id}`}
        className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#13131a] p-6 transition-all duration-300 ${
          isPending ? "pointer-events-none" : "hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        } ${
          isFinished ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-white/[0.07] hover:border-violet-500/30"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          {/* FIXED: Removed corrupted characters and used standard icons */}
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${
              course.isCloned ? "bg-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)] text-violet-400" : (isFinished ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/[0.1] text-violet-400")
          }`}>
            {course.isCloned ? <BookOpen className="h-5 w-5" /> : (isFinished ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />)}
          </div>
          <div className="flex flex-col items-end gap-1.5">
              {course.level && (
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.08em] ${badgeStyle}`}>
                  {course.level}
                </span>
              )}
              {course.isCloned && (
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-violet-400">
                      Enrolled
                  </span>
              )}
          </div>
        </div>

        <h3 className="mb-1.5 font-display text-[0.95rem] font-bold leading-snug tracking-tight text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="mb-4 line-clamp-2 text-[0.8rem] leading-relaxed text-white/30">
            {course.description}
          </p>
        )}

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
    </div>
  )
}

function EmptyState() {
  return (
    <div className="relative mt-4 flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />

      <div className="relative mb-8">
        {/* FIXED: Removed corrupted Unicode character */}
        <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-[2rem] border border-white/10 bg-[#13131a] shadow-2xl shadow-violet-500/10">
          <BookOpen className="h-10 w-10 text-violet-500" />
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
  // FIXED: Destructure isLoaded from Clerk
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const { data, error, isLoading, mutate } = useSWR(
    email ? `/api/courses?email=${email}` : null, 
    fetcher,
      {
          revalidateOnMount: true, 
          dedupingInterval: 0     
      }
  );

  // FIXED: Block rendering until Clerk is fully loaded AND SWR has tried fetching
  if (!isLoaded || (email && isLoading)) {
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>;
  }

  // If fully loaded and no email/data, show empty state
  if (error || !data || data.length === 0) return <EmptyState />;

  const courseList = data.map((c: any) => ({
    id: c.cid,
    title: c.name,
    description: c.description,
    modules: c.numberOfModules,
    level: c.difficultyLevel,
    progress: c.progress || 0,
    isCloned: c.isCloned 
  }));

  const activeCourses = courseList.filter((c: any) => c.progress < 100);
  const completedCourses = courseList.filter((c: any) => c.progress === 100);

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-12">
          {activeCourses.length > 0 && (
              <div>
                  <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-violet-400" /> Resume Learning
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {activeCourses.map((course: any) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        refreshData={() => mutate()} 
                      />
                    ))}
                  </div>
              </div>
          )}

          {completedCourses.length > 0 && (
              <div>
                  <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Completed Courses
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {completedCourses.map((course: any) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        refreshData={() => mutate()} 
                      />
                    ))}
                  </div>
              </div>
          )}
        </div>
    </div>
  )
}

export default Courses