"use client"
import React, { useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import Link from 'next/link'

export default function MyLearningHub() {
    const { user } = useUser()
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            const fetchCourses = async () => {
                try {
                    const res = await axios.get(`/api/courses?email=${user.primaryEmailAddress!.emailAddress}`)
                    setCourses(res.data)
                } catch (error) {
                    console.error("Failed hub fetch:", error)
                } finally { setLoading(false) }
            }
            fetchCourses()
        }
    }, [user])

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-violet-500" /></div>

    return (
        <div className="p-10 max-w-7xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">My Learning Journey</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                    <Link href={`/workspace/edit-course/${course.cid}`} key={course.cid} className="border border-white/5 bg-[#13131a] p-6 rounded-2xl hover:border-violet-500/50 transition-all">
                        <h2 className="font-bold mb-2">{course.name}</h2>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-violet-500" style={{ width: `${course.progress || 0}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold">{course.progress || 0}% Complete</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}