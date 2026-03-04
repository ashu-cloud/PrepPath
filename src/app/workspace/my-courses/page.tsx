"use client"
import React, { useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, PlayCircle, Loader2, Compass, Sparkles } from 'lucide-react'
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
            
            {courses.length === 0 ? (
                /* Premium Empty State UI */
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-white/5 bg-[#13131a] rounded-3xl shadow-xl">
                    <div className="bg-violet-500/10 p-5 rounded-full mb-6 border border-violet-500/20">
                        <BookOpen size={40} className="text-violet-500 opacity-90" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                        Your learning journey awaits
                    </h2>
                    <p className="text-gray-400 max-w-lg mb-10 leading-relaxed text-sm md:text-base">
                        Discover tailored learning paths crafted by our community, or use AI to generate your own personalized curriculum from the dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
                        {/* Update these hrefs to match your actual routing */}
                        <Link href="/workspace/explore" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-2">
                            <Compass size={18} />
                            Explore Community
                        </Link>
                        <Link href="/workspace/" className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2">
                            {/* <Sparkles size={18} /> */}
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            ) : (
                /* Existing Grid UI */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map((course: any) => (
                        <Link href={`/workspace/edit-course/${course.cid}`} key={course.cid} className="border border-white/5 bg-[#13131a] p-6 rounded-2xl hover:border-violet-500/50 transition-all group">
                            <h2 className="font-bold mb-2 group-hover:text-violet-400 transition-colors">{course.name}</h2>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${course.progress || 0}%` }} />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-wider">{course.progress || 0}% Complete</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}