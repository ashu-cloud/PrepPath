"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { ChevronLeft, Loader2, PlayCircle } from 'lucide-react'
import CourseInfo from '../_components/courseinfo'
import ChapterTopicList from '../_components/ChapterTopicList'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useUser } from '@clerk/nextjs'

function EditCourse() {
    const { courseId } = useParams()
    const router = useRouter()
    const { user } = useUser()
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState<any>(null);
    
    // New states for our buttons
    const [hasContent, setHasContent] = useState(false);
    const [isFullyGenerated, setIsFullyGenerated] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        if (!courseId) return;

        const fetchCourse = async () => {
            setLoading(true);
            try {
                // Fetch BOTH course details and generated lessons
                const [courseRes, lessonsRes] = await Promise.all([
                    axios.get(`/api/courses?courseId=${courseId}`),
                    axios.get(`/api/get-lessons?courseId=${courseId}`)
                ]);
                
                const course = courseRes.data;
                const lessons = lessonsRes.data;
                setCourseData(course);
                
                // Calculate if generation is complete
                const courseLayout = typeof course?.courseJson === 'string' 
                    ? JSON.parse(course.courseJson).course 
                    : course?.courseJson?.course;
                    
                const totalChapters = courseLayout?.chapters?.length || 0;
                
                setHasContent(lessons.length > 0);
                setIsFullyGenerated(totalChapters > 0 && lessons.length >= totalChapters);

            } catch (err) {
                console.error("Failed to load course", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                <p className="animate-pulse font-mono text-sm tracking-widest text-gray-500 uppercase">
                    Loading Course Structure...
                </p>
            </div>
        )
    }

    const handleStartCourse = async () => {
        // Check if the current user is the owner
        const isOwner = courseData?.userEmail === user?.primaryEmailAddress?.emailAddress;

        if (isOwner) {
            // If already owned, just go to study
            router.push(`/workspace/study/${courseId}`);
        } else {
            // If NOT owned, enroll (clone) first
            setIsEnrolling(true);
            try {
                const res = await axios.post('/api/enroll-course', {
                    sourceCid: courseId
                });
                // Redirect to the NEWly created course study page
                router.push(`/workspace/study/${res.data.newCid}`);
            } catch (err) {
                console.error("Enrollment failed", err);
                alert("Failed to add course to your list.");
            } finally {
                setIsEnrolling(false);
            }
        }
    };

    return (
        <div className="mx-auto max-w-6xl p-6 md:p-10">
            {/* 1. TOP NAVIGATION & HEADER */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push('/workspace')}
                    className="flex w-fit items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
                
                <div className="flex items-center gap-4">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter hidden sm:block">
                        Course ID: {courseId?.toString().slice(0,8)}...
                     </span>
                     
                     {/* --- START COURSE BUTTON LOGIC --- */}
                     {hasContent ? (
                         <Button 
                            onClick={handleStartCourse}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:scale-105"
                         >
                             <PlayCircle className="h-4 w-4" /> Start Course
                         </Button>
                     ) : (
                         <TooltipProvider>
                             <Tooltip>
                                 {/* We wrap the disabled button in a div so hover events still trigger the tooltip */}
                                 <TooltipTrigger asChild>
                                     <div className="cursor-not-allowed">
                                         <Button disabled className="bg-emerald-900/40 text-emerald-500/50 font-bold gap-2 px-6 rounded-xl pointer-events-none">
                                             <PlayCircle className="h-4 w-4" /> Start Course
                                         </Button>
                                     </div>
                                 </TooltipTrigger>
                                 <TooltipContent side="bottom" className="bg-[#0f0f12] text-white border border-white/10 shadow-2xl">
                                     <p>Generate the course first</p>
                                 </TooltipContent>
                             </Tooltip>
                         </TooltipProvider>
                     )}
                </div>
            </div>

            {/* 2. THE MAIN CONTENT */}
            <div className="flex flex-col gap-10">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Pass the state and a callback to update it when generation finishes */}
                    <CourseInfo 
                        courseData={courseData} 
                        isFullyGenerated={isFullyGenerated}
                        onGenerationComplete={() => {
                            setHasContent(true);
                            setIsFullyGenerated(true);
                        }}
                    />
                </div>
                
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <ChapterTopicList courseData={courseData} />
                </div>
            </div>
        </div>
    )
}

export default EditCourse