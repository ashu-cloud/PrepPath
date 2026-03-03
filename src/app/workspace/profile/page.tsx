import { currentUser } from '@clerk/nextjs/server'
import db from '@/config/db'
import { coursesTable, chapterProgressTable, enrollmentsTable } from '@/config/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { BookOpen, Trophy, BarChart2, Target, Mail, Layers } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const LEVEL_STYLE: Record<string, string> = {
  Beginner:     'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400',
  Intermediate: 'border-amber-500/30  bg-amber-500/[0.06]  text-amber-400',
  Advanced:     'border-red-400/30    bg-red-400/[0.06]    text-red-400',
}

function StatCard({ icon: Icon, label, value, color = 'violet' }: {
  icon: React.ElementType; label: string; value: string | number; color?: string
}) {
  const colors: Record<string, string> = {
    violet:  'bg-violet-500/[0.08] text-violet-400',
    emerald: 'bg-emerald-500/[0.08] text-emerald-400',
    sky:     'bg-sky-500/[0.08] text-sky-400',
    amber:   'bg-amber-500/[0.08] text-amber-400',
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#13131a] p-5">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div>
        <p className="font-display text-[1.4rem] font-extrabold leading-none tracking-tight text-white">{value}</p>
        <p className="mt-0.5 text-[0.72rem] text-white/30">{label}</p>
      </div>
    </div>
  )
}

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const email = user.emailAddresses[0]?.emailAddress ?? ''

  // 1. Courses the user CREATED
  const createdCourses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.userEmail, email))

  // 2. Courses the user ENROLLED in (but didn't create)
  const enrollments = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.userEmail, email))

  const enrolledCids = enrollments.map(e => e.courseCid)

  const enrolledCourses = enrolledCids.length > 0
    ? await db
        .select()
        .from(coursesTable)
        .where(inArray(coursesTable.cid, enrolledCids))
    : []

  // 3. Merge + deduplicate by cid
  const seen = new Set<string>()
  const courses = [...createdCourses, ...enrolledCourses].filter(c => {
    if (seen.has(c.cid)) return false
    seen.add(c.cid)
    return true
  })

  // 4. Fetch all completed progress for this user
  const userProgress = courses.length > 0
    ? await db
        .select()
        .from(chapterProgressTable)
        .where(
          and(
            eq(chapterProgressTable.userEmail, email),
            eq(chapterProgressTable.isCompleted, true)
          )
        )
    : []

  // 5. Computed stats
  const totalModules     = courses.reduce((acc, c) => acc + (c.numberOfModules || 0), 0)
  const completedModules = userProgress.length
  const overallProgress  = totalModules > 0
    ? Math.round((completedModules / totalModules) * 100)
    : 0

  // 6. Recent 3 courses with per-course progress
  const recentCourses = [...courses].reverse().slice(0, 3).map(course => {
    const done  = userProgress.filter(p => p.courseCid === course.cid).length
    const total = course.numberOfModules || 0
    return {
      ...course,
      progress:      total > 0 ? Math.round((done / total) * 100) : 0,
      chaptersDone:  done,
      chaptersTotal: total,
    }
  })

  const completedCoursesCount = courses.filter(course => {
    const done  = userProgress.filter(p => p.courseCid === course.cid).length
    const total = course.numberOfModules || 0
    return total > 0 && done >= total
  }).length

  const displayName = user.fullName ?? user.username ?? 'Learner'
  const initials    = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const joinDate    = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#070708] p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Heading */}
        <div>
          <p className="mb-1 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
            <span className="h-px w-5 bg-violet-400" />
            Account
          </p>
          <h1 className="font-display text-[1.6rem] font-extrabold tracking-tight text-white">My Profile</h1>
        </div>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131a] p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-violet-600/[0.08] blur-[70px]" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={displayName}
                  className="h-20 w-20 rounded-2xl object-cover ring-4 ring-violet-500/20" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 text-2xl font-black text-white ring-4 ring-violet-500/20">
                  {initials}
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1">
              <h2 className="font-display text-[1.3rem] font-extrabold tracking-tight text-white">{displayName}</h2>
              <p className="mb-3 text-[0.82rem] text-white/30">Joined {joinDate}</p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[0.72rem] text-white/40">
                  <Mail className="h-3 w-3" /> {email}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/[0.07] px-3 py-1 text-[0.72rem] text-violet-300">
                  <Target className="h-3 w-3" />
                  {courses.length === 0 ? 'No courses yet' : `${courses.length} course${courses.length > 1 ? 's' : ''} enrolled`}
                </span>
              </div>
            </div>

            {/* Progress score */}
            <div className="flex flex-col items-center rounded-2xl border border-white/[0.07] bg-[#0d0d10] px-6 py-4 text-center">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/20">Overall Progress</p>
              <p className="my-1 font-display text-[2.2rem] font-extrabold leading-none tracking-tight text-white">
                {overallProgress}%
              </p>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400"
                  style={{ width: `${overallProgress}%` }} />
              </div>
              <p className="mt-1 text-[0.6rem] text-white/20">{completedModules}/{totalModules} modules</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={BookOpen}  label="Total Courses"  value={courses.length}        color="violet"  />
          <StatCard icon={Trophy}    label="Completed"      value={completedCoursesCount} color="amber"   />
          <StatCard icon={BarChart2} label="Modules Done"   value={completedModules}      color="emerald" />
          <StatCard icon={Layers}    label="Total Modules"  value={totalModules}          color="sky"     />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Recent courses */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-6">
            <h3 className="mb-5 flex items-center gap-2 font-display text-[0.95rem] font-bold text-white">
              <BookOpen className="h-4 w-4 text-violet-400" /> Recent Courses
            </h3>
            {recentCourses.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-[0.82rem] text-white/25">No courses yet.</p>
                <Link href="/workspace/dashboard"
                  className="mt-3 text-[0.78rem] text-violet-400 transition-colors hover:text-violet-300">
                  Generate your first course →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCourses.map(course => (
                  <Link key={course.cid} href={`/workspace/study/${course.cid}`}
                    className="group block rounded-xl border border-white/[0.05] bg-[#0d0d10] p-4 transition-all hover:border-violet-500/20">
                    <div className="mb-2.5 flex items-start justify-between gap-2">
                      <p className="flex-1 text-[0.83rem] font-medium leading-snug text-white/60 transition-colors group-hover:text-white/85">
                        {course.name}
                      </p>
                      <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.06em] ${LEVEL_STYLE[course.difficultyLevel] ?? LEVEL_STYLE['Beginner']}`}>
                        {course.difficultyLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                          style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="flex-shrink-0 font-mono text-[0.65rem] text-white/25">
                        {course.chaptersDone}/{course.chaptersTotal}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Account info */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-6">
            <h3 className="mb-5 flex items-center gap-2 font-display text-[0.95rem] font-bold text-white">
              <Target className="h-4 w-4 text-violet-400" /> Account Info
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Full Name',    value: displayName },
                { label: 'Email',        value: email },
                { label: 'Member Since', value: joinDate },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="mb-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/20">{label}</p>
                  <p className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-[0.83rem] text-white/50">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}